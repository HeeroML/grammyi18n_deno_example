export * from 'https://cdn.skypack.dev/@grammyjs/types@v2.0.2?dts';
import { YamlLoader } from "https://deno.land/x/yaml_loader/mod.ts";
import { I18nContext } from './context.ts';
import { pluralize } from './pluralize.ts';
import { createRequire } from "https://deno.land/std@0.93.0/node/module.ts";
import tableize from './tabelize.ts';
const yamlLoader = new YamlLoader();
const require = createRequire(import.meta.url);
const fs = require("fs");
const path = require("path");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImkxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsY0FBYyxvREFBb0QsQ0FBQTtBQUVsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFHcEUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGNBQWMsQ0FBQTtBQUN4QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUE7QUFDeEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzVFLE9BQU8sUUFBUSxNQUFNLGVBQWUsQ0FBQTtBQUNwQyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFjN0IsTUFBTSxPQUFPLElBQUk7SUFJZixZQUFZLFNBQTBCLEVBQUU7UUFIeEMsZUFBVSxHQUFlLEVBQUUsQ0FBQTtRQUl6QixJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osZUFBZSxFQUFFLElBQUk7WUFDckIsV0FBVyxFQUFFLFNBQVM7WUFDdEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsWUFBWSxFQUFFO2dCQUNaLFNBQVM7YUFDVjtZQUNELEdBQUcsTUFBTTtTQUNWLENBQUE7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUN4QztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsU0FBaUI7UUFDM0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMs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