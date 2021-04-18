import { Composer, run } from './composer.ts';
import { Context } from './context.ts';
import { Api } from './core/api.ts';
import { GrammyError } from './core/error.ts';
import { debug as d } from './platform.ts';
const debug = d('grammy:bot');
const debugErr = d('grammy:error');
export class BotError extends Error {
    constructor(error, ctx) {
        super('Error in middleware!');
        this.error = error;
        this.ctx = ctx;
    }
}
export class Bot extends Composer {
    constructor(token, config) {
        super();
        this.token = token;
        this.pollingRunning = false;
        this.lastTriedUpdateId = 0;
        this.errorHandler = async (err) => {
            console.error('Error in middleware while handling update', err.ctx?.update?.update_id, err.error);
            console.error('No error handler was set!');
            console.error('Set your own error handler with `bot.catch = ...`');
            if (this.pollingRunning) {
                console.error('Stopping bot');
                await this.stop();
            }
            throw err;
        };
        if (token.length === 0)
            throw new Error('Empty token!');
        this.botInfo = config?.botInfo;
        this.clientConfig = config?.client;
        this.ContextConstructor =
            config?.ContextConstructor ??
                Context;
        this.api = new Api(token, this.clientConfig);
    }
    async init() {
        if (this.botInfo === undefined) {
            debug('Initializing bot');
            this.botInfo = await this.api.getMe();
        }
        else {
            debug('Bot already initialized!');
        }
        debug(`I am ${this.botInfo.username}!`);
    }
    async handleUpdate(update, webhookReplyEnvelope) {
        if (this.botInfo === undefined)
            throw new Error('Bot not initialized!');
        debug(`Processing update ${update.update_id}`);
        const api = new Api(this.token, this.clientConfig, webhookReplyEnvelope);
        const t = this.api.config.installedTransformers();
        if (t.length > 0)
            api.config.use(...t);
        const ctx = new this.ContextConstructor(update, api, this.botInfo);
        try {
            await run(this.middleware(), ctx);
        }
        catch (err) {
            debugErr(`Error in middleware for update ${update.update_id}`);
            throw new BotError(err, ctx);
        }
    }
    async start(options) {
        await this.init();
        if (this.pollingRunning) {
            debug('Simple long polling already running!');
            return;
        }
        await this.api.deleteWebhook({
            drop_pending_updates: options?.drop_pending_updates,
        });
        debug('Starting simple long polling');
        this.pollingRunning = true;
        this.pollingAbortController = new AbortController();
        const limit = options?.limit;
        const timeout = options?.timeout ?? 30;
        let allowed_updates = options?.allowed_updates;
        while (this.pollingRunning) {
            const offset = this.lastTriedUpdateId + 1;
            let updates = undefined;
            let maxRetries = 1200;
            do {
                try {
                    updates = await this.api.getUpdates({ offset, limit, timeout, allowed_updates }, this.pollingAbortController.signal);
                }
                catch (error) {
                    if (this.pollingRunning && error instanceof GrammyError) {
                        debugErr(`Call to \`getUpdates\` failed, retrying in 3 seconds ...`);
                        await new Promise(r => setTimeout(r, 3000));
                    }
                    else {
                        throw error;
                    }
                }
            } while (updates === undefined &&
                this.pollingRunning &&
                maxRetries-- > 0);
            if (updates === undefined)
                break;
            for (const update of updates) {
                this.lastTriedUpdateId = update.update_id;
                try {
                    await this.handleUpdate(update);
                }
                catch (err) {
                    await this.errorHandler(err);
                }
            }
            allowed_updates = undefined;
        }
    }
    async stop() {
        if (this.pollingRunning) {
            debug('Stopping bot, saving update offset');
            this.pollingRunning = false;
            this.pollingAbortController?.abort();
            await this.api.getUpdates({ offset: this.lastTriedUpdateId + 1 });
            this.pollingAbortController = undefined;
        }
        else {
            debug('Bot is not running!');
        }
    }
    catch(errorHandler) {
        this.errorHandler = errorHandler;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYm90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQzdDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUVuQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDN0MsT0FBTyxFQUFVLEtBQUssSUFBSSxDQUFDLEVBQWlCLE1BQU0sZUFBZSxDQUFBO0FBQ2pFLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUM3QixNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUE7QUF3Q2xDLE1BQU0sT0FBTyxRQUE0QixTQUFRLEtBQUs7SUFDbEQsWUFBNEIsS0FBYyxFQUFrQixHQUFNO1FBQzlELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBREwsVUFBSyxHQUFMLEtBQUssQ0FBUztRQUFrQixRQUFHLEdBQUgsR0FBRyxDQUFHO0lBRWxFLENBQUM7Q0FDSjtBQTBERCxNQUFNLE9BQU8sR0FBaUMsU0FBUSxRQUFXO0lBNkQ3RCxZQUE0QixLQUFhLEVBQUUsTUFBcUI7UUFDNUQsS0FBSyxFQUFFLENBQUE7UUFEaUIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQTVEakMsbUJBQWMsR0FBRyxLQUFLLENBQUE7UUFFdEIsc0JBQWlCLEdBQUcsQ0FBQyxDQUFBO1FBMEI3QixpQkFBWSxHQUFvQixLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDeEMsT0FBTyxDQUFDLEtBQUssQ0FDVCwyQ0FBMkMsRUFDM0MsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUMxQixHQUFHLENBQUMsS0FBSyxDQUNaLENBQUE7WUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUE7WUFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFBO1lBQ2xFLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDN0IsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDcEI7WUFDRCxNQUFNLEdBQUcsQ0FBQTtRQUNiLENBQUMsQ0FBQTtRQXFCRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQUUsT0FBTyxDQUFBO1FBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxFQUFFLE1BQU0sQ0FBQTtRQUNsQyxJQUFJLENBQUMsa0JBQWtCO1lBQ25CLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQ3pCLE9BRU0sQ0FBQTtRQUNYLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUNoRCxDQUFDO0lBTUQsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzVCLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ3hDO2FBQU07WUFDSCxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtTQUNwQztRQUNELEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBY0QsS0FBSyxDQUFDLFlBQVksQ0FDZCxNQUFjLEVBQ2Qsb0JBQTJDO1FBRTNDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBQ3ZFLEtBQUssQ0FBQyxxQkFBcUIsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFFOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUE7UUFFeEUsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtRQUNqRCxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFFdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDbEUsSUFBSTtZQUVBLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNwQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsUUFBUSxDQUFDLGtDQUFrQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtZQUM5RCxNQUFNLElBQUksUUFBUSxDQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNsQztJQUNMLENBQUM7SUFtQ0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUF3QjtRQUNoQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDckIsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7WUFDN0MsT0FBTTtTQUNUO1FBQ0QsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztZQUN6QixvQkFBb0IsRUFBRSxPQUFPLEVBQUUsb0JBQW9CO1NBQ3RELENBQUMsQ0FBQTtRQUNGLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBO1FBQzFCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFBO1FBRW5ELE1BQU0sS0FBSyxHQUFHLE9BQU8sRUFBRSxLQUFLLENBQUE7UUFDNUIsTUFBTSxPQUFPLEdBQUcsT0FBTyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUE7UUFDdEMsSUFBSSxlQUFlLEdBQUcsT0FBTyxFQUFFLGVBQWUsQ0FBQTtRQUU5QyxPQUFPLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQTtZQUN6QyxJQUFJLE9BQU8sR0FBeUIsU0FBUyxDQUFBO1lBQzdDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQTtZQUNyQixHQUFHO2dCQUNDLElBQUk7b0JBQ0EsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQy9CLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQzNDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQ3JDLENBQUE7aUJBQ0o7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ1osSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEtBQUssWUFBWSxXQUFXLEVBQUU7d0JBQ3JELFFBQVEsQ0FDSiwwREFBMEQsQ0FDN0QsQ0FBQTt3QkFDRCxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO3FCQUM5Qzt5QkFBTTt3QkFDSCxNQUFNLEtBQUssQ0FBQTtxQkFDZDtpQkFDSjthQUNKLFFBQ0csT0FBTyxLQUFLLFNBQVM7Z0JBQ3JCLElBQUksQ0FBQyxjQUFjO2dCQUNuQixVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQ25CO1lBQ0QsSUFBSSxPQUFPLEtBQUssU0FBUztnQkFBRSxNQUFLO1lBRWhDLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO2dCQUMxQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQTtnQkFDekMsSUFBSTtvQkFDQSxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7aUJBQ2xDO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDL0I7YUFDSjtZQUdELGVBQWUsR0FBRyxTQUFTLENBQUE7U0FDOUI7SUFDTCxDQUFDO0lBaUJELEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JCLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO1lBQzNDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFBO1lBQzNCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsQ0FBQTtZQUNwQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2pFLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLENBQUE7U0FDMUM7YUFBTTtZQUNILEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1NBQy9CO0lBQ0wsQ0FBQztJQWNELEtBQUssQ0FBQyxZQUE2QjtRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTtJQUNwQyxDQUFDO0NBQ0oifQ==