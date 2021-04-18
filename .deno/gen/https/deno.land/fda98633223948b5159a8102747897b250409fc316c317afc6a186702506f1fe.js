import "./global.ts";
import nodeAssert from "./assert.ts";
import nodeBuffer from "./buffer.ts";
import nodeCrypto from "./crypto.ts";
import nodeConstants from "./constants.ts";
import nodeEvents from "./events.ts";
import nodeFS from "./fs.ts";
import nodeOs from "./os.ts";
import nodePath from "./path.ts";
import nodeQueryString from "./querystring.ts";
import nodeStream from "./stream.ts";
import nodeStringDecoder from "./string_decoder.ts";
import nodeTimers from "./timers.ts";
import nodeTty from "./tty.ts";
import nodeUrl from "./url.ts";
import nodeUtil from "./util.ts";
import * as path from "../path/mod.ts";
import { assert } from "../_util/assert.ts";
import { fileURLToPath, pathToFileURL } from "./url.ts";
import { isWindows } from "../_util/os.ts";
const CHAR_FORWARD_SLASH = "/".charCodeAt(0);
const CHAR_BACKWARD_SLASH = "\\".charCodeAt(0);
const CHAR_COLON = ":".charCodeAt(0);
const relativeResolveCache = Object.create(null);
let requireDepth = 0;
let statCache = null;
function stat(filename) {
    filename = path.toNamespacedPath(filename);
    if (statCache !== null) {
        const result = statCache.get(filename);
        if (result !== undefined)
            return result;
    }
    try {
        const info = Deno.statSync(filename);
        const result = info.isFile ? 0 : 1;
        if (statCache !== null)
            statCache.set(filename, result);
        return result;
    }
    catch (e) {
        if (e instanceof Deno.errors.PermissionDenied) {
            throw new Error("CJS loader requires --allow-read.");
        }
        return -1;
    }
}
function updateChildren(parent, child, scan) {
    const children = parent && parent.children;
    if (children && !(scan && children.includes(child))) {
        children.push(child);
    }
}
class Module {
    constructor(id = "", parent) {
        this.id = id;
        this.exports = {};
        this.parent = parent || null;
        updateChildren(parent || null, this, false);
        this.filename = null;
        this.loaded = false;
        this.children = [];
        this.paths = [];
        this.path = path.dirname(id);
    }
    require(id) {
        if (id === "") {
            throw new Error(`id '${id}' must be a non-empty string`);
        }
        requireDepth++;
        try {
            return Module._load(id, this, false);
        }
        finally {
            requireDepth--;
        }
    }
    load(filename) {
        assert(!this.loaded);
        this.filename = filename;
        this.paths = Module._nodeModulePaths(path.dirname(filename));
        const extension = findLongestRegisteredExtension(filename);
        Module._extensions[extension](this, filename);
        this.loaded = true;
    }
    _compile(content, filename) {
        const compiledWrapper = wrapSafe(filename, content);
        const dirname = path.dirname(filename);
        const require = makeRequireFunction(this);
        const exports = this.exports;
        const thisValue = exports;
        if (requireDepth === 0) {
            statCache = new Map();
        }
        const result = compiledWrapper.call(thisValue, exports, require, this, filename, dirname);
        if (requireDepth === 0) {
            statCache = null;
        }
        return result;
    }
    static _resolveLookupPaths(request, parent) {
        if (request.charAt(0) !== "." ||
            (request.length > 1 &&
                request.charAt(1) !== "." &&
                request.charAt(1) !== "/" &&
                (!isWindows || request.charAt(1) !== "\\"))) {
            let paths = modulePaths;
            if (parent !== null && parent.paths && parent.paths.length) {
                paths = parent.paths.concat(paths);
            }
            return paths.length > 0 ? paths : null;
        }
        if (!parent || !parent.id || !parent.filename) {
            return ["."].concat(Module._nodeModulePaths("."), modulePaths);
        }
        return [path.dirname(parent.filename)];
    }
    static _resolveFilename(request, parent, isMain, options) {
        if (nativeModuleCanBeRequiredByUsers(request)) {
            return request;
        }
        let paths;
        if (typeof options === "object" && options !== null) {
            if (Array.isArray(options.paths)) {
                const isRelative = request.startsWith("./") ||
                    request.startsWith("../") ||
                    (isWindows && request.startsWith(".\\")) ||
                    request.startsWith("..\\");
                if (isRelative) {
                    paths = options.paths;
                }
                else {
                    const fakeParent = new Module("", null);
                    paths = [];
                    for (let i = 0; i < options.paths.length; i++) {
                        const path = options.paths[i];
                        fakeParent.paths = Module._nodeModulePaths(path);
                        const lookupPaths = Module._resolveLookupPaths(request, fakeParent);
                        for (let j = 0; j < lookupPaths.length; j++) {
                            if (!paths.includes(lookupPaths[j])) {
                                paths.push(lookupPaths[j]);
                            }
                        }
                    }
                }
            }
            else if (options.paths === undefined) {
                paths = Module._resolveLookupPaths(request, parent);
            }
            else {
                throw new Error("options.paths is invalid");
            }
        }
        else {
            paths = Module._resolveLookupPaths(request, parent);
        }
        const filename = Module._findPath(request, paths, isMain);
        if (!filename) {
            const requireStack = [];
            for (let cursor = parent; cursor; cursor = cursor.parent) {
                requireStack.push(cursor.filename || cursor.id);
            }
            let message = `Cannot find module '${request}'`;
            if (requireStack.length > 0) {
                message = message + "\nRequire stack:\n- " + requireStack.join("\n- ");
            }
            const err = new Error(message);
            err.code = "MODULE_NOT_FOUND";
            err.requireStack = requireStack;
            throw err;
        }
        return filename;
    }
    static _findPath(request, paths, isMain) {
        const absoluteRequest = path.isAbsolute(request);
        if (absoluteRequest) {
            paths = [""];
        }
        else if (!paths || paths.length === 0) {
            return false;
        }
        const cacheKey = request + "\x00" +
            (paths.length === 1 ? paths[0] : paths.join("\x00"));
        const entry = Module._pathCache[cacheKey];
        if (entry) {
            return entry;
        }
        let exts;
        let trailingSlash = request.length > 0 &&
            request.charCodeAt(request.length - 1) === CHAR_FORWARD_SLASH;
        if (!trailingSlash) {
            trailingSlash = /(?:^|\/)\.?\.$/.test(request);
        }
        for (let i = 0; i < paths.length; i++) {
            const curPath = paths[i];
            if (curPath && stat(curPath) < 1)
                continue;
            const basePath = resolveExports(curPath, request, absoluteRequest);
            let filename;
            const rc = stat(basePath);
            if (!trailingSlash) {
                if (rc === 0) {
                    filename = toRealPath(basePath);
                }
                if (!filename) {
                    if (exts === undefined)
                        exts = Object.keys(Module._extensions);
                    filename = tryExtensions(basePath, exts, isMain);
                }
            }
            if (!filename && rc === 1) {
                if (exts === undefined)
                    exts = Object.keys(Module._extensions);
                filename = tryPackage(basePath, exts, isMain, request);
            }
            if (filename) {
                Module._pathCache[cacheKey] = filename;
                return filename;
            }
        }
        return false;
    }
    static _load(request, parent, isMain) {
        let relResolveCacheIdentifier;
        if (parent) {
            relResolveCacheIdentifier = `${parent.path}\x00${request}`;
            const filename = relativeResolveCache[relResolveCacheIdentifier];
            if (filename !== undefined) {
                const cachedModule = Module._cache[filename];
                if (cachedModule !== undefined) {
                    updateChildren(parent, cachedModule, true);
                    if (!cachedModule.loaded) {
                        return getExportsForCircularRequire(cachedModule);
                    }
                    return cachedModule.exports;
                }
                delete relativeResolveCache[relResolveCacheIdentifier];
            }
        }
        const filename = Module._resolveFilename(request, parent, isMain);
        const cachedModule = Module._cache[filename];
        if (cachedModule !== undefined) {
            updateChildren(parent, cachedModule, true);
            if (!cachedModule.loaded) {
                return getExportsForCircularRequire(cachedModule);
            }
            return cachedModule.exports;
        }
        const mod = loadNativeModule(filename, request);
        if (mod)
            return mod.exports;
        const module = new Module(filename, parent);
        if (isMain) {
            module.id = ".";
        }
        Module._cache[filename] = module;
        if (parent !== undefined) {
            assert(relResolveCacheIdentifier);
            relativeResolveCache[relResolveCacheIdentifier] = filename;
        }
        let threw = true;
        try {
            module.load(filename);
            threw = false;
        }
        finally {
            if (threw) {
                delete Module._cache[filename];
                if (parent !== undefined) {
                    assert(relResolveCacheIdentifier);
                    delete relativeResolveCache[relResolveCacheIdentifier];
                }
            }
            else if (module.exports &&
                Object.getPrototypeOf(module.exports) ===
                    CircularRequirePrototypeWarningProxy) {
                Object.setPrototypeOf(module.exports, PublicObjectPrototype);
            }
        }
        return module.exports;
    }
    static wrap(script) {
        script = script.replace(/^#!.*?\n/, "");
        return `${Module.wrapper[0]}${script}${Module.wrapper[1]}`;
    }
    static _nodeModulePaths(from) {
        if (isWindows) {
            from = path.resolve(from);
            if (from.charCodeAt(from.length - 1) === CHAR_BACKWARD_SLASH &&
                from.charCodeAt(from.length - 2) === CHAR_COLON) {
                return [from + "node_modules"];
            }
            const paths = [];
            for (let i = from.length - 1, p = 0, last = from.length; i >= 0; --i) {
                const code = from.charCodeAt(i);
                if (code === CHAR_BACKWARD_SLASH ||
                    code === CHAR_FORWARD_SLASH ||
                    code === CHAR_COLON) {
                    if (p !== nmLen)
                        paths.push(from.slice(0, last) + "\\node_modules");
                    last = i;
                    p = 0;
                }
                else if (p !== -1) {
                    if (nmChars[p] === code) {
                        ++p;
                    }
                    else {
                        p = -1;
                    }
                }
            }
            return paths;
        }
        else {
            from = path.resolve(from);
            if (from === "/")
                return ["/node_modules"];
            const paths = [];
            for (let i = from.length - 1, p = 0, last = from.length; i >= 0; --i) {
                const code = from.charCodeAt(i);
                if (code === CHAR_FORWARD_SLASH) {
                    if (p !== nmLen)
                        paths.push(from.slice(0, last) + "/node_modules");
                    last = i;
                    p = 0;
                }
                else if (p !== -1) {
                    if (nmChars[p] === code) {
                        ++p;
                    }
                    else {
                        p = -1;
                    }
                }
            }
            paths.push("/node_modules");
            return paths;
        }
    }
    static createRequire(filename) {
        let filepath;
        if (filename instanceof URL ||
            (typeof filename === "string" && !path.isAbsolute(filename))) {
            filepath = fileURLToPath(filename);
        }
        else if (typeof filename !== "string") {
            throw new Error("filename should be a string");
        }
        else {
            filepath = filename;
        }
        return createRequireFromPath(filepath);
    }
    static _initPaths() {
        const homeDir = Deno.env.get("HOME");
        const nodePath = Deno.env.get("NODE_PATH");
        let paths = [];
        if (homeDir) {
            paths.unshift(path.resolve(homeDir, ".node_libraries"));
            paths.unshift(path.resolve(homeDir, ".node_modules"));
        }
        if (nodePath) {
            paths = nodePath
                .split(path.delimiter)
                .filter(function pathsFilterCB(path) {
                return !!path;
            })
                .concat(paths);
        }
        modulePaths = paths;
        Module.globalPaths = modulePaths.slice(0);
    }
    static _preloadModules(requests) {
        if (!Array.isArray(requests)) {
            return;
        }
        const parent = new Module("internal/preload", null);
        try {
            parent.paths = Module._nodeModulePaths(Deno.cwd());
        }
        catch (e) {
            if (e.code !== "ENOENT") {
                throw e;
            }
        }
        for (let n = 0; n < requests.length; n++) {
            parent.require(requests[n]);
        }
    }
}
Module.builtinModules = [];
Module._extensions = Object.create(null);
Module._cache = Object.create(null);
Module._pathCache = Object.create(null);
Module.globalPaths = [];
Module.wrapper = [
    "(function (exports, require, module, __filename, __dirname) { ",
    "\n});",
];
const nativeModulePolyfill = new Map();
function createNativeModule(id, exports) {
    const mod = new Module(id);
    mod.exports = exports;
    mod.loaded = true;
    return mod;
}
nativeModulePolyfill.set("assert", createNativeModule("assert", nodeAssert));
nativeModulePolyfill.set("buffer", createNativeModule("buffer", nodeBuffer));
nativeModulePolyfill.set("constants", createNativeModule("constants", nodeConstants));
nativeModulePolyfill.set("crypto", createNativeModule("crypto", nodeCrypto));
nativeModulePolyfill.set("events", createNativeModule("events", nodeEvents));
nativeModulePolyfill.set("fs", createNativeModule("fs", nodeFS));
nativeModulePolyfill.set("module", createNativeModule("module", Module));
nativeModulePolyfill.set("os", createNativeModule("os", nodeOs));
nativeModulePolyfill.set("path", createNativeModule("path", nodePath));
nativeModulePolyfill.set("querystring", createNativeModule("querystring", nodeQueryString));
nativeModulePolyfill.set("stream", createNativeModule("stream", nodeStream));
nativeModulePolyfill.set("string_decoder", createNativeModule("string_decoder", nodeStringDecoder));
nativeModulePolyfill.set("timers", createNativeModule("timers", nodeTimers));
nativeModulePolyfill.set("tty", createNativeModule("tty", nodeTty));
nativeModulePolyfill.set("url", createNativeModule("url", nodeUrl));
nativeModulePolyfill.set("util", createNativeModule("util", nodeUtil));
function loadNativeModule(_filename, request) {
    return nativeModulePolyfill.get(request);
}
function nativeModuleCanBeRequiredByUsers(request) {
    return nativeModulePolyfill.has(request);
}
for (const id of nativeModulePolyfill.keys()) {
    Module.builtinModules.push(id);
}
let modulePaths = [];
const packageJsonCache = new Map();
function readPackage(requestPath) {
    const jsonPath = path.resolve(requestPath, "package.json");
    const existing = packageJsonCache.get(jsonPath);
    if (existing !== undefined) {
        return existing;
    }
    let json;
    try {
        json = new TextDecoder().decode(Deno.readFileSync(path.toNamespacedPath(jsonPath)));
    }
    catch {
    }
    if (json === undefined) {
        packageJsonCache.set(jsonPath, null);
        return null;
    }
    try {
        const parsed = JSON.parse(json);
        const filtered = {
            name: parsed.name,
            main: parsed.main,
            exports: parsed.exports,
            type: parsed.type,
        };
        packageJsonCache.set(jsonPath, filtered);
        return filtered;
    }
    catch (e) {
        e.path = jsonPath;
        e.message = "Error parsing " + jsonPath + ": " + e.message;
        throw e;
    }
}
function readPackageScope(checkPath) {
    const rootSeparatorIndex = checkPath.indexOf(path.sep);
    let separatorIndex;
    while ((separatorIndex = checkPath.lastIndexOf(path.sep)) > rootSeparatorIndex) {
        checkPath = checkPath.slice(0, separatorIndex);
        if (checkPath.endsWith(path.sep + "node_modules"))
            return false;
        const pjson = readPackage(checkPath);
        if (pjson) {
            return {
                path: checkPath,
                data: pjson,
            };
        }
    }
    return false;
}
function readPackageMain(requestPath) {
    const pkg = readPackage(requestPath);
    return pkg ? pkg.main : undefined;
}
function readPackageExports(requestPath) {
    const pkg = readPackage(requestPath);
    return pkg ? pkg.exports : undefined;
}
function tryPackage(requestPath, exts, isMain, _originalPath) {
    const pkg = readPackageMain(requestPath);
    if (!pkg) {
        return tryExtensions(path.resolve(requestPath, "index"), exts, isMain);
    }
    const filename = path.resolve(requestPath, pkg);
    let actual = tryFile(filename, isMain) ||
        tryExtensions(filename, exts, isMain) ||
        tryExtensions(path.resolve(filename, "index"), exts, isMain);
    if (actual === false) {
        actual = tryExtensions(path.resolve(requestPath, "index"), exts, isMain);
        if (!actual) {
            const err = new Error(`Cannot find module '${filename}'. ` +
                'Please verify that the package.json has a valid "main" entry');
            err.code = "MODULE_NOT_FOUND";
            throw err;
        }
    }
    return actual;
}
function tryFile(requestPath, _isMain) {
    const rc = stat(requestPath);
    return rc === 0 && toRealPath(requestPath);
}
function toRealPath(requestPath) {
    return Deno.realPathSync(requestPath);
}
function tryExtensions(p, exts, isMain) {
    for (let i = 0; i < exts.length; i++) {
        const filename = tryFile(p + exts[i], isMain);
        if (filename) {
            return filename;
        }
    }
    return false;
}
function findLongestRegisteredExtension(filename) {
    const name = path.basename(filename);
    let currentExtension;
    let index;
    let startIndex = 0;
    while ((index = name.indexOf(".", startIndex)) !== -1) {
        startIndex = index + 1;
        if (index === 0)
            continue;
        currentExtension = name.slice(index);
        if (Module._extensions[currentExtension])
            return currentExtension;
    }
    return ".js";
}
function isConditionalDotExportSugar(exports, _basePath) {
    if (typeof exports === "string")
        return true;
    if (Array.isArray(exports))
        return true;
    if (typeof exports !== "object")
        return false;
    let isConditional = false;
    let firstCheck = true;
    for (const key of Object.keys(exports)) {
        const curIsConditional = key[0] !== ".";
        if (firstCheck) {
            firstCheck = false;
            isConditional = curIsConditional;
        }
        else if (isConditional !== curIsConditional) {
            throw new Error('"exports" cannot ' +
                "contain some keys starting with '.' and some not. The exports " +
                "object must either be an object of package subpath keys or an " +
                "object of main entry condition name keys only.");
        }
    }
    return isConditional;
}
function applyExports(basePath, expansion) {
    const mappingKey = `.${expansion}`;
    let pkgExports = readPackageExports(basePath);
    if (pkgExports === undefined || pkgExports === null) {
        return path.resolve(basePath, mappingKey);
    }
    if (isConditionalDotExportSugar(pkgExports, basePath)) {
        pkgExports = { ".": pkgExports };
    }
    if (typeof pkgExports === "object") {
        if (Object.prototype.hasOwnProperty.call(pkgExports, mappingKey)) {
            const mapping = pkgExports[mappingKey];
            return resolveExportsTarget(pathToFileURL(basePath + "/"), mapping, "", basePath, mappingKey);
        }
        if (mappingKey === ".")
            return basePath;
        let dirMatch = "";
        for (const candidateKey of Object.keys(pkgExports)) {
            if (candidateKey[candidateKey.length - 1] !== "/")
                continue;
            if (candidateKey.length > dirMatch.length &&
                mappingKey.startsWith(candidateKey)) {
                dirMatch = candidateKey;
            }
        }
        if (dirMatch !== "") {
            const mapping = pkgExports[dirMatch];
            const subpath = mappingKey.slice(dirMatch.length);
            return resolveExportsTarget(pathToFileURL(basePath + "/"), mapping, subpath, basePath, mappingKey);
        }
    }
    if (mappingKey === ".")
        return basePath;
    const e = new Error(`Package exports for '${basePath}' do not define ` +
        `a '${mappingKey}' subpath`);
    e.code = "MODULE_NOT_FOUND";
    throw e;
}
const EXPORTS_PATTERN = /^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$/;
function resolveExports(nmPath, request, absoluteRequest) {
    if (!absoluteRequest) {
        const [, name, expansion = ""] = request.match(EXPORTS_PATTERN) || [];
        if (!name) {
            return path.resolve(nmPath, request);
        }
        const basePath = path.resolve(nmPath, name);
        return applyExports(basePath, expansion);
    }
    return path.resolve(nmPath, request);
}
const cjsConditions = new Set(["require", "node"]);
function resolveExportsTarget(pkgPath, target, subpath, basePath, mappingKey) {
    if (typeof target === "string") {
        if (target.startsWith("./") &&
            (subpath.length === 0 || target.endsWith("/"))) {
            const resolvedTarget = new URL(target, pkgPath);
            const pkgPathPath = pkgPath.pathname;
            const resolvedTargetPath = resolvedTarget.pathname;
            if (resolvedTargetPath.startsWith(pkgPathPath) &&
                resolvedTargetPath.indexOf("/node_modules/", pkgPathPath.length - 1) ===
                    -1) {
                const resolved = new URL(subpath, resolvedTarget);
                const resolvedPath = resolved.pathname;
                if (resolvedPath.startsWith(resolvedTargetPath) &&
                    resolvedPath.indexOf("/node_modules/", pkgPathPath.length - 1) === -1) {
                    return fileURLToPath(resolved);
                }
            }
        }
    }
    else if (Array.isArray(target)) {
        for (const targetValue of target) {
            if (Array.isArray(targetValue))
                continue;
            try {
                return resolveExportsTarget(pkgPath, targetValue, subpath, basePath, mappingKey);
            }
            catch (e) {
                if (e.code !== "MODULE_NOT_FOUND")
                    throw e;
            }
        }
    }
    else if (typeof target === "object" && target !== null) {
        for (const key of Object.keys(target)) {
            if (key !== "default" && !cjsConditions.has(key)) {
                continue;
            }
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                try {
                    return resolveExportsTarget(pkgPath, target[key], subpath, basePath, mappingKey);
                }
                catch (e) {
                    if (e.code !== "MODULE_NOT_FOUND")
                        throw e;
                }
            }
        }
    }
    let e;
    if (mappingKey !== ".") {
        e = new Error(`Package exports for '${basePath}' do not define a ` +
            `valid '${mappingKey}' target${subpath ? " for " + subpath : ""}`);
    }
    else {
        e = new Error(`No valid exports main found for '${basePath}'`);
    }
    e.code = "MODULE_NOT_FOUND";
    throw e;
}
const nmChars = [115, 101, 108, 117, 100, 111, 109, 95, 101, 100, 111, 110];
const nmLen = nmChars.length;
function emitCircularRequireWarning(prop) {
    console.error(`Accessing non-existent property '${String(prop)}' of module exports inside circular dependency`);
}
const CircularRequirePrototypeWarningProxy = new Proxy({}, {
    get(target, prop) {
        if (prop in target)
            return target[prop];
        emitCircularRequireWarning(prop);
        return undefined;
    },
    getOwnPropertyDescriptor(target, prop) {
        if (Object.prototype.hasOwnProperty.call(target, prop)) {
            return Object.getOwnPropertyDescriptor(target, prop);
        }
        emitCircularRequireWarning(prop);
        return undefined;
    },
});
const PublicObjectPrototype = globalThis.Object.prototype;
function getExportsForCircularRequire(module) {
    if (module.exports &&
        Object.getPrototypeOf(module.exports) === PublicObjectPrototype &&
        !module.exports.__esModule) {
        Object.setPrototypeOf(module.exports, CircularRequirePrototypeWarningProxy);
    }
    return module.exports;
}
function wrapSafe(filename, content) {
    const wrapper = Module.wrap(content);
    const [f, err] = Deno.core.evalContext(wrapper, filename);
    if (err) {
        throw err;
    }
    return f;
}
Module._extensions[".js"] = (module, filename) => {
    if (filename.endsWith(".js")) {
        const pkg = readPackageScope(filename);
        if (pkg !== false && pkg.data && pkg.data.type === "module") {
            throw new Error("Importing ESM module");
        }
    }
    const content = new TextDecoder().decode(Deno.readFileSync(filename));
    module._compile(content, filename);
};
Module._extensions[".json"] = (module, filename) => {
    const content = new TextDecoder().decode(Deno.readFileSync(filename));
    try {
        module.exports = JSON.parse(stripBOM(content));
    }
    catch (err) {
        err.message = filename + ": " + err.message;
        throw err;
    }
};
function createRequireFromPath(filename) {
    const trailingSlash = filename.endsWith("/") ||
        (isWindows && filename.endsWith("\\"));
    const proxyPath = trailingSlash ? path.join(filename, "noop.js") : filename;
    const m = new Module(proxyPath);
    m.filename = proxyPath;
    m.paths = Module._nodeModulePaths(m.path);
    return makeRequireFunction(m);
}
function makeRequireFunction(mod) {
    const require = function require(path) {
        return mod.require(path);
    };
    function resolve(request, options) {
        return Module._resolveFilename(request, mod, false, options);
    }
    require.resolve = resolve;
    function paths(request) {
        return Module._resolveLookupPaths(request, mod);
    }
    resolve.paths = paths;
    require.extensions = Module._extensions;
    require.cache = Module._cache;
    return require;
}
function stripBOM(content) {
    if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
    }
    return content;
}
export const builtinModules = Module.builtinModules;
export const createRequire = Module.createRequire;
export default Module;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFCQSxPQUFPLGFBQWEsQ0FBQztBQUVyQixPQUFPLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxVQUFVLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sVUFBVSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLGFBQWEsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxNQUFNLE1BQU0sU0FBUyxDQUFDO0FBQzdCLE9BQU8sTUFBTSxNQUFNLFNBQVMsQ0FBQztBQUM3QixPQUFPLFFBQVEsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxlQUFlLE1BQU0sa0JBQWtCLENBQUM7QUFDL0MsT0FBTyxVQUFVLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8saUJBQWlCLE1BQU0scUJBQXFCLENBQUM7QUFDcEQsT0FBTyxVQUFVLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sT0FBTyxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLE9BQU8sTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxRQUFRLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sS0FBSyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sVUFBVSxHQUFH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