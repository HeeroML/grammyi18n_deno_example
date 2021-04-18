import { debug as d, baseFetchConfig, } from '../platform.ts';
import { GrammyError } from './error.ts';
import { requiresFormDataUpload, transformPayload, createJsonPayload, createFormDataPayload, } from './payload.ts';
const debug = d('grammy:core');
const concatTransformer = (prev, trans) => (method, payload, signal) => trans(prev, method, payload, signal);
const DEFAULT_OPTIONS = {
    apiRoot: 'https://api.telegram.org',
    buildUrl: (root, token, method) => `${root}/bot${token}/${method}`,
    baseFetchConfig,
    canUseWebhookReply: () => false,
};
class ApiClient {
    constructor(token, options, webhookReplyEnvelope = {}) {
        this.token = token;
        this.webhookReplyEnvelope = webhookReplyEnvelope;
        this.hasUsedWebhookReply = false;
        this.installedTransformers = [];
        this.call = async (method, payload, signal) => {
            debug('Calling', method);
            const url = this.options.buildUrl(this.options.apiRoot, this.token, method);
            const transformed = transformPayload(method, payload ?? {});
            const config = requiresFormDataUpload(transformed)
                ? createFormDataPayload(transformed)
                : createJsonPayload(transformed);
            if (this.webhookReplyEnvelope.send !== undefined &&
                !this.hasUsedWebhookReply &&
                typeof config.body === 'string' &&
                this.options.canUseWebhookReply(method)) {
                this.hasUsedWebhookReply = true;
                await this.webhookReplyEnvelope.send(config.body);
                return { ok: true, result: true };
            }
            else {
                const res = await fetch(url, {
                    ...this.options.baseFetchConfig,
                    signal,
                    ...config,
                });
                return await res.json();
            }
        };
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }
    use(...transformers) {
        this.call = transformers.reduce(concatTransformer, this.call);
        this.installedTransformers.push(...transformers);
        return this;
    }
    async callApi(method, payload, signal) {
        const data = await this.call(method, payload, signal);
        if (data.ok)
            return data.result;
        else
            throw new GrammyError(`Call to ${method} failed!`, data, payload);
    }
}
export function createRawApi(token, options, webhookReplyEnvelope) {
    const client = new ApiClient(token, options, webhookReplyEnvelope);
    const proxyHandler = {
        get(_, m) {
            return client.callApi.bind(client, m);
        },
        ...proxyMethods,
    };
    const raw = new Proxy({}, proxyHandler);
    const installedTransformers = client.installedTransformers;
    const api = {
        raw,
        installedTransformers,
        use: (...t) => {
            client.use(...t);
            return api;
        },
    };
    return api;
}
const proxyMethods = {
    set() {
        return false;
    },
    defineProperty() {
        return false;
    },
    deleteProperty() {
        return false;
    },
    ownKeys() {
        return [];
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCxLQUFLLElBQUksQ0FBQyxFQUdWLGVBQWUsR0FDbEIsTUFBTSxnQkFBZ0IsQ0FBQTtBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBQ3hDLE9BQU8sRUFDSCxzQkFBc0IsRUFDdEIsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDeEIsTUFBTSxjQUFjLENBQUE7QUFDckIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBeUU5QixNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBZSxFQUFFLEtBQWtCLEVBQWEsRUFBRSxDQUFDLENBQzFFLE1BQU0sRUFDTixPQUFPLEVBQ1AsTUFBTSxFQUNSLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFtRXpDLE1BQU0sZUFBZSxHQUErQjtJQUNoRCxPQUFPLEVBQUUsMEJBQTBCO0lBQ25DLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksT0FBTyxLQUFLLElBQUksTUFBTSxFQUFFO0lBQ2xFLGVBQWU7SUFDZixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLO0NBQ2xDLENBQUE7QUFFRCxNQUFNLFNBQVM7SUFPWCxZQUNxQixLQUFhLEVBQzlCLE9BQTBCLEVBQ1QsdUJBQTZDLEVBQUU7UUFGL0MsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUViLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBMkI7UUFQNUQsd0JBQW1CLEdBQUcsS0FBSyxDQUFBO1FBRTFCLDBCQUFxQixHQUFrQixFQUFFLENBQUE7UUFVMUMsU0FBSSxHQUFjLEtBQUssRUFBRSxNQUFNLEVBQUUs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