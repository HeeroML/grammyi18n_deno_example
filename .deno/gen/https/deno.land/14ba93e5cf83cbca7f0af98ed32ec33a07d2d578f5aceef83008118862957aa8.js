export class I18nContext {
    constructor(repository, config, languageCode, templateData) {
        this.repository = repository;
        this.config = config;
        this.templateData = {
            ...config.templateData,
            ...templateData
        };
        const result = parseLanguageCode(this.repository, this.config.defaultLanguage, languageCode);
        this.languageCode = result.languageCode;
        this.shortLanguageCode = result.shortLanguageCode;
    }
    locale(languageCode) {
        if (!languageCode) {
            return this.languageCode;
        }
        const result = parseLanguageCode(this.repository, this.config.defaultLanguage, languageCode);
        this.languageCode = result.languageCode;
        this.shortLanguageCode = result.shortLanguageCode;
    }
    getTemplate(languageCode, resourceKey) {
        const repositoryEntry = this.repository[languageCode];
        return repositoryEntry?.[resourceKey];
    }
    t(resourceKey, templateData = {}) {
        let template = this.getTemplate(this.languageCode, resourceKey) ?? this.getTemplate(this.shortLanguageCode, resourceKey);
        if (!template && this.config.defaultLanguageOnMissing) {
            template = this.getTemplate(this.config.defaultLanguage, resourceKey);
        }
        if (!template && this.config.allowMissing) {
            template = () => resourceKey;
        }
        if (!template) {
            throw new Error(`grammy-i18n: '${this.languageCode}.${resourceKey}' not found`);
        }
        const data = {
            ...this.templateData,
            ...templateData
        };
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'function') {
                data[key] = value.bind(this);
            }
        }
        return template(data);
    }
}
function parseLanguageCode(repository, defaultLanguage, languageCode) {
    let code = languageCode.toLowerCase();
    const shortCode = shortLanguageCodeFromLong(code);
    if (!repository[code] && !repository[shortCode]) {
        code = defaultLanguage;
    }
    return {
        languageCode: code,
        shortLanguageCode: shortLanguageCodeFromLong(code)
    };
}
function shortLanguageCodeFromLong(languageCode) {
    return languageCode.split('-')[0];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxPQUFPLFdBQVc7SUFPdEIsWUFBWSxVQUFnQyxFQUFFLE1BQWMsRUFBRSxZQUFvQixFQUFFLFlBQW9DO1FBQ3RILElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDbEIsR0FBRyxNQUFNLENBQUMsWUFBWTtZQUN0QixHQUFHLFlBQVk7U0FDaEIsQ0FBQTtRQUVELE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFDNUYsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUE7SUFDbkQsQ0FBQztJQUlELE1BQU0sQ0FBQyxZQUFxQjtRQUMxQixJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQTtTQUN6QjtRQUVELE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFDNUYsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUE7SUFDbkQsQ0FBQztJQUVELFdBQVcsQ0FBQyxZQUFvQixFQUFFLFdBQW1CO1FBQ25ELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDckQsT0FBTyxlQUFlLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0lBRUQsQ0FBQyxDQUFDLFdBQW1CLEVBQUUsZUFBdUMsRUFBRTtRQUM5RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFFeEgsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFO1lBQ3JELFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1NBQ3RFO1FBRUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUN6QyxRQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFBO1NBQzdCO1FBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLElBQUksQ0FBQyxZQUFZLElBQUksV0FBVyxhQUFhLENBQUMsQ0FBQTtTQUNoRjtRQUVELE1BQU0sSUFBSSxHQUFpQjtZQUN6QixHQUFHLElBQUksQ0FBQyxZQUFZO1lBQ3BCLEdBQUcsWUFBWTtTQUNoQixDQUFBO1FBRUQsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0MsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQzdCO1NBQ0Y7UUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN2QixDQUFDO0NBQ0Y7QUFFRCxTQUFTLGlCQUFpQixDQUFDLFVBQWdDLEVBQUUsZUFBdUIsRUFBRSxZQUFvQjtJQUN4RyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDckMsTUFBTSxTQUFTLEdBQUcseUJBQXlCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMvQyxJQUFJLEdBQUcsZUFBZSxDQUFBO0tBQ3ZCO0lBRUQsT0FBTztRQUNMLFlBQVksRUFBRSxJQUFJO1FBQ2xCLGlCQUFpQixFQUFFLHlCQUF5QixDQUFDLElBQUksQ0FBQztLQUNuRCxDQUFBO0FBQ0gsQ0FBQztBQUVELFNBQVMseUJBQXlCLENBQUMsWUFBb0I7SUFDckQsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFBO0FBQ3BDLENBQUMifQ==