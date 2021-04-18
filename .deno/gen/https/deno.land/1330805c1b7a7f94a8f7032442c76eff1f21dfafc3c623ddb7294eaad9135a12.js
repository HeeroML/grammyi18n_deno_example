import * as path from "https://deno.land/std@0.93.0/path/mod.ts";
export * from 'https://cdn.skypack.dev/@grammyjs/types@v2.0.2?dts';
import { YamlLoader } from "https://deno.land/x/yaml_loader/mod.ts";
import { I18nContext } from './context.ts';
import { pluralize } from './pluralize.ts';
import { createRequire } from "https://deno.land/std@0.93.0/node/module.ts";
import tableize from './tabelize.ts';
const yamlLoader = new YamlLoader();
const require = createRequire(import.meta.url);
const fs = require("fs");
export class I18n {
    constructor(config = {}) {
        this.repository = {};
        this.config = {
            defaultLanguage: 'en',
            sessionName: 'session',
            allowMissing: true,
            templateData: {
                pluralize
            },
            ...config
        };
        if (this.config.directory) {
            this.loadLocales(this.config.directory);
        }
    }
    loadLocales(directory) {
        if (!fs.existsSync(directory)) {
            throw new Error(`Locales directory '${directory}' not found`);
        }
        const files = fs.readdirSync(directory);
        for (const fileName of files) {
            const extension = path.extname(fileName);
            const languageCode = path.basename(fileName, extension).toLowerCase();
            const fileContent = fs.readFileSync(path.resolve(directory, fileName), 'utf8');
            let data;
            if (extension === '.yaml' || extension === '.yml') {
                data = yamlLoader.parseFile(fileContent);
            }
            else if (extension === '.json') {
                data = JSON.parse(fileContent);
            }
            this.loadLocale(languageCode, tableize(data));
        }
    }
    loadLocale(languageCode, i18nData) {
        const language = languageCode.toLowerCase();
        const tableized = tableize(i18nData);
        const ensureStringData = {};
        for (const [key, value] of Object.entries(tableized)) {
            ensureStringData[key] = String(value);
        }
        this.repository[language] = {
            ...this.repository[language],
            ...compileTemplates(tableize(ensureStringData))
        };
    }
    resetLocale(languageCode) {
        if (languageCode) {
            delete this.repository[languageCode.toLowerCase()];
        }
        else {
            this.repository = {};
        }
    }
    availableLocales() {
        return Object.keys(this.repository);
    }
    resourceKeys(languageCode) {
        const language = languageCode.toLowerCase();
        return Object.keys(this.repository[language] ?? {});
    }
    missingKeys(languageOfInterest, referenceLanguage = this.config.defaultLanguage) {
        const interest = this.resourceKeys(languageOfInterest);
        const reference = this.resourceKeys(referenceLanguage);
        return reference.filter(ref => !interest.includes(ref));
    }
    overspecifiedKeys(languageOfInterest, referenceLanguage = this.config.defaultLanguage) {
        return this.missingKeys(referenceLanguage, languageOfInterest);
    }
    translationProgress(languageOfInterest, referenceLanguage = this.config.defaultLanguage) {
        const reference = this.resourceKeys(referenceLanguage).length;
        const missing = this.missingKeys(languageOfInterest, referenceLanguage).length;
        return (reference - missing) / reference;
    }
    createContext(languageCode, templateData) {
        return new I18nContext(this.repository, this.config, languageCode, templateData);
    }
    middleware() {
        return async (ctx, next) => {
            const session = this.config.useSession && ctx[this.config.sessionName];
            const languageCode = session?.__language_code ?? ctx.from?.language_code ?? this.config.defaultLanguage;
            ctx.i18n = new I18nContext(this.repository, this.config, languageCode, {
                from: ctx.from,
                chat: ctx.chat
            });
            await next();
            if (session) {
                session.__language_code = ctx.i18n.locale();
            }
        };
    }
    t(languageCode, resourceKey, templateData = {}) {
        return this.createContext(languageCode, templateData).t(resourceKey);
    }
}
function compileTemplates(root) {
    const result = {};
    for (const [key, value] of Object.entries(root)) {
        if (value.includes('${')) {
            result[key] = compile(value);
        }
        else {
            result[key] = () => value;
        }
    }
    return result;
}
const regex = /`/gm;
export function escape(template) {
    return `\`${template.replace(regex, '\\`')}\``;
}
export function compile(template) {
    const script = escape(template);
    return (context) => {
        try {
            return Object.assign({ context });
        }
        catch (err) {
            throw new Error('Failed to compile template');
        }
    };
}
export function match(resourceKey, templateData) {
    return (text, ctx) => {
        if (!ctx?.i18n) {
            throw new TypeError('Your context does not have i18n available. Check the examples if you use match correctly.');
        }
        if (text && ctx.i18n.t(resourceKey, templateData) === text) {
            return Object.assign([text], {
                index: 0,
                input: text
            });
        }
        return null;
    };
}
export function reply(resourceKey) {
    return async (ctx) => ctx.reply(ctx.i18n.t(resourceKey));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImkxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSwwQ0FBMEMsQ0FBQztBQUdqRSxjQUFjLG9EQUFvRCxDQUFBO0FBRWxFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUdwRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFBO0FBQ3hDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQTtBQUN4QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDNUUsT0FBTyxRQUFRLE1BQU0sZUFBZSxDQUFBO0FBQ3BDLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDcEMsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0MsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBYXpCLE1BQU0sT0FBTyxJQUFJO0lBSWYsWUFBWSxTQUEwQixFQUFFO1FBSHhDLGVBQVUsR0FBZSxFQUFFLENBQUE7UUFJekIsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNaLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFlBQVksRUFBRTtnQkFDWixTQUFTO2FBQ1Y7WUFDRCxHQUFHLE1BQU07U0FDVixDQUFBO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDeEM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FB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