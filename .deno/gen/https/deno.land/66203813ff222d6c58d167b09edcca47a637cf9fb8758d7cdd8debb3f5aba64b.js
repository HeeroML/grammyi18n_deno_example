import { AssertionError } from "./assertion_error.ts";
import * as asserts from "../testing/asserts.ts";
import { inspect } from "./util.ts";
import { ERR_AMBIGUOUS_ARGUMENT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS, } from "./_errors.ts";
function toNode(fn, opts) {
    const { operator, message, actual, expected } = opts || {};
    try {
        fn();
    }
    catch (e) {
        if (e instanceof asserts.AssertionError) {
            if (typeof message === "string") {
                throw new AssertionError({
                    operator,
                    message,
                    actual,
                    expected,
                });
            }
            else if (message instanceof Error) {
                throw message;
            }
            else {
                throw new AssertionError({
                    operator,
                    message: e.message,
                    actual,
                    expected,
                });
            }
        }
        throw e;
    }
}
function assert(actual, message) {
    if (arguments.length === 0) {
        throw new AssertionError({
            message: "No value argument passed to `assert.ok()`",
        });
    }
    toNode(() => asserts.assert(actual), { message, actual, expected: true });
}
const ok = assert;
function throws(fn, error, message) {
    if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", "function", fn);
    }
    if (typeof error === "object" && error !== null &&
        Object.getPrototypeOf(error) === Object.prototype &&
        Object.keys(error).length === 0) {
        throw new ERR_INVALID_ARG_VALUE("error", error, "may not be an empty object");
    }
    if (typeof message === "string") {
        if (!(error instanceof RegExp) && typeof error !== "function" &&
            !(error instanceof Error) && typeof error !== "object") {
            throw new ERR_INVALID_ARG_TYPE("error", [
                "Function",
                "Error",
                "RegExp",
                "Object",
            ], error);
        }
    }
    else {
        if (typeof error !== "undefined" && typeof error !== "string" &&
            !(error instanceof RegExp) && typeof error !== "function" &&
            !(error instanceof Error) && typeof error !== "object") {
            throw new ERR_INVALID_ARG_TYPE("error", [
                "Function",
                "Error",
                "RegExp",
                "Object",
            ], error);
        }
    }
    try {
        fn();
    }
    catch (e) {
        if (typeof error === "string") {
            if (arguments.length === 3) {
                throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
            }
            else if (typeof e === "object" && e !== null) {
                if (e.message === error) {
                    throw new ERR_AMBIGUOUS_ARGUMENT("error/message", `The error message "${e.message}" is identical to the message.`);
                }
            }
            else if (e === error) {
                throw new ERR_AMBIGUOUS_ARGUMENT("error/message", `The error "${e}" is identical to the message.`);
            }
            message = error;
            error = undefined;
        }
        if (error instanceof Function && error.prototype !== undefined) {
            if (e instanceof error) {
                return;
            }
            throw new AssertionError({
                message: `The error is expected to be an instance of "${error.name}". Received "${e
                    ?.constructor?.name}"\n\nError message:\n\n${e.message}`,
                actual: e,
                expected: error,
                operator: "throws",
            });
        }
        if (error instanceof Function) {
            const received = error(e);
            if (received === true) {
                return;
            }
            throw new AssertionError({
                message: `The validation function is expected to return "true": received ${received}`,
                actual: e,
                expected: error,
                operator: "throws",
            });
        }
        if (error instanceof RegExp) {
            if (error.test(String(e))) {
                return;
            }
            throw new AssertionError({
                message: `The input did not match the regular expression ${error.toString()}. Input:\n\n'${String(e)}'\n`,
                actual: e,
                expected: error,
                operator: "throws",
            });
        }
        if (typeof error === "object" && error !== null) {
            const keys = Object.keys(error);
            if (error instanceof Error) {
                keys.push("name", "message");
            }
            for (const k of keys) {
                if (e == null) {
                    throw new AssertionError({
                        message: message || "object is expected to thrown, but got null",
                        actual: e,
                        expected: error,
                        operator: "throws",
                    });
                }
                if (typeof e === "string") {
                    throw new AssertionError({
                        message: message ||
                            `object is expected to thrown, but got string: ${e}`,
                        actual: e,
                        expected: error,
                        operator: "throws",
                    });
                }
                if (!(k in e)) {
                    throw new AssertionError({
                        message: message || `A key in the expected object is missing: ${k}`,
                        actual: e,
                        expected: error,
                        operator: "throws",
                    });
                }
                const actual = e[k];
                const expected = error[k];
                if (typeof actual === "string" && expected instanceof RegExp) {
                    match(actual, expected);
                }
                else {
                    deepStrictEqual(actual, expected);
                }
            }
            return;
        }
        if (typeof error === "undefined") {
            return;
        }
        throw new Error(`Invalid expectation: ${error}`);
    }
    if (message) {
        let msg = `Missing expected exception: ${message}`;
        if (typeof error === "function" && error?.name) {
            msg = `Missing expected exception (${error.name}): ${message}`;
        }
        throw new AssertionError({
            message: msg,
            operator: "throws",
            actual: undefined,
            expected: error,
        });
    }
    else if (typeof error === "string") {
        throw new AssertionError({
            message: `Missing expected exception: ${error}`,
            operator: "throws",
            actual: undefined,
            expected: undefined,
        });
    }
    else if (typeof error === "function" && error?.prototype !== undefined) {
        throw new AssertionError({
            message: `Missing expected exception (${error.name}).`,
            operator: "throws",
            actual: undefined,
            expected: error,
        });
    }
    else {
        throw new AssertionError({
            message: "Missing expected exception.",
            operator: "throws",
            actual: undefined,
            expected: error,
        });
    }
}
function doesNotThrow(fn, expected, message) {
    if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", "function", fn);
    }
    else if (!(expected instanceof RegExp) && typeof expected !== "function" &&
        typeof expected !== "string" && typeof expected !== "undefined") {
        throw new ERR_INVALID_ARG_TYPE("expected", ["Function", "RegExp"], fn);
    }
    if (typeof expected === "string") {
        try {
            fn();
        }
        catch (e) {
            throw new AssertionError({
                message: `Got unwanted exception: ${expected}\nActual message: "${e.message}"`,
                operator: "doesNotThrow",
            });
        }
        return;
    }
    else if (typeof expected === "function" && expected.prototype !== undefined) {
        try {
            fn();
        }
        catch (e) {
            if (e instanceof expected) {
                let msg = `Got unwanted exception: ${e.constructor?.name}`;
                if (message) {
                    msg += ` ${String(message)}`;
                }
                throw new AssertionError({
                    message: msg,
                    operator: "doesNotThrow",
                });
            }
            throw e;
        }
        return;
    }
    else {
        try {
            fn();
        }
        catch (e) {
            if (message) {
                throw new AssertionError({
                    message: `Got unwanted exception: ${message}\nActual message: "${e ? e.message : String(e)}"`,
                    operator: "doesNotThrow",
                });
            }
            throw new AssertionError({
                message: `Got unwanted exception.\nActual message: "${e ? e.message : String(e)}"`,
                operator: "doesNotThrow",
            });
        }
        return;
    }
}
function equal(actual, expected, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    if (actual == expected) {
        return;
    }
    if (Number.isNaN(actual) && Number.isNaN(expected)) {
        return;
    }
    if (typeof message === "string") {
        throw new AssertionError({
            message,
        });
    }
    else if (message instanceof Error) {
        throw message;
    }
    toNode(() => asserts.assertStrictEquals(actual, expected), {
        message: message || `${actual} == ${expected}`,
        operator: "==",
        actual,
        expected,
    });
}
function notEqual(actual, expected, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    if (Number.isNaN(actual) && Number.isNaN(expected)) {
        throw new AssertionError({
            message: `${actual} != ${expected}`,
            operator: "!=",
            actual,
            expected,
        });
    }
    if (actual != expected) {
        return;
    }
    if (typeof message === "string") {
        throw new AssertionError({
            message,
        });
    }
    else if (message instanceof Error) {
        throw message;
    }
    toNode(() => asserts.assertNotStrictEquals(actual, expected), {
        message: message || `${actual} != ${expected}`,
        operator: "!=",
        actual,
        expected,
    });
}
function strictEqual(actual, expected, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    toNode(() => asserts.assertStrictEquals(actual, expected), { message, operator: "strictEqual", actual, expected });
}
function notStrictEqual(actual, expected, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    toNode(() => asserts.assertNotStrictEquals(actual, expected), { message, actual, expected, operator: "notStrictEqual" });
}
function deepEqual() {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    throw new Error("Not implemented");
}
function notDeepEqual() {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    throw new Error("Not implemented");
}
function deepStrictEqual(actual, expected, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    toNode(() => asserts.assertEquals(actual, expected), { message, actual, expected, operator: "deepStrictEqual" });
}
function notDeepStrictEqual(actual, expected, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
    }
    toNode(() => asserts.assertNotEquals(actual, expected), { message, actual, expected, operator: "deepNotStrictEqual" });
}
function fail() {
    toNode(() => fail());
}
function match(actual, regexp, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "regexp");
    }
    if (!(regexp instanceof RegExp)) {
        throw new ERR_INVALID_ARG_TYPE("regexp", "RegExp", regexp);
    }
    toNode(() => asserts.assertMatch(actual, regexp), { message, actual, expected: regexp, operator: "match" });
}
function doesNotMatch(string, regexp, message) {
    if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("string", "regexp");
    }
    if (!(regexp instanceof RegExp)) {
        throw new ERR_INVALID_ARG_TYPE("regexp", "RegExp", regexp);
    }
    if (typeof string !== "string") {
        if (message instanceof Error) {
            throw message;
        }
        throw new AssertionError({
            message: message ||
                `The "string" argument must be of type string. Received type ${typeof string} (${inspect(string)})`,
            actual: string,
            expected: regexp,
            operator: "doesNotMatch",
        });
    }
    toNode(() => asserts.assertNotMatch(string, regexp), { message, actual: string, expected: regexp, operator: "doesNotMatch" });
}
function strict(actual, message) {
    if (arguments.length === 0) {
        throw new AssertionError({
            message: "No value argument passed to `assert.ok()`",
        });
    }
    assert(actual, message);
}
Object.assign(strict, {
    AssertionError,
    deepEqual: deepStrictEqual,
    deepStrictEqual,
    doesNotMatch,
    doesNotThrow,
    equal: strictEqual,
    fail,
    match,
    notDeepEqual: notDeepStrictEqual,
    notDeepStrictEqual,
    notEqual: notStrictEqual,
    notStrictEqual,
    ok,
    strict,
    strictEqual,
    throws,
});
export default Object.assign(assert, {
    AssertionError,
    deepEqual,
    deepStrictEqual,
    doesNotMatch,
    doesNotThrow,
    equal,
    fail,
    match,
    notDeepEqual,
    notDeepStrictEqual,
    notEqual,
    notStrictEqual,
    ok,
    strict,
    strictEqual,
    throws,
});
export { AssertionError, deepEqual, deepStrictEqual, doesNotMatch, doesNotThrow, equal, fail, match, notDeepEqual, notDeepStrictEqual, notEqual, notStrictEqual, ok, strict, strictEqual, throws, };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXNzZXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEtBQUssT0FBTyxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixvQkFBb0IsRUFDcEIscUJBQXFCLEVBQ3JCLGdCQUFnQixHQUNqQixNQUFNLGNBQWMsQ0FBQztBQUd0QixTQUFTLE1BQU0sQ0FDYixFQUFjLEVBQ2QsSUFLQztJQUVELE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzNELElBQUk7UUFDRixFQUFFLEVBQUUsQ0FBQztLQUNOO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixJQUFJLENBQUMsWUFBWSxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3ZDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUMvQixNQUFNLElBQUksY0FBYyxDQUFDO29CQUN2QixRQUFRO29CQUNSLE9BQU87b0JBQ1AsTUFBTTtvQkFDTixRQUFRO2lCQUNULENBQUMsQ0FBQzthQUNKO2lCQUFNLElBQUksT0FBTyxZQUFZLEtBQUssRUFBRTtnQkFDbkMsTUFBTSxPQUFPLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxNQUFNLElBQUksY0FBYyxDQUFDO29CQUN2QixRQUFRO29CQUNSLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztvQkFDbEIsTUFBTTtvQkFDTixRQUFRO2lCQUNULENBQUMsQ0FBQzthQUNKO1NBQ0Y7UUFDRCxNQUFNLENBQUMsQ0FBQztLQUNUO0FBQ0gsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLE1BQWUsRUFBRSxPQUF3QjtJQUN2RCxJ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