import { debug as d } from '../platform.ts';
const debugErr = d('grammy:error');
const standard = (req, res) => ({
    update: req.body,
    respond: json => res.send(json),
});
const withCtx = ctx => ({
    update: ctx.req.body,
    respond: json => (ctx.response.body = json),
});
const frameworkAdapters = {
    express: standard,
    http: standard,
    https: standard,
    koa: withCtx,
    oak: withCtx,
    fastify: standard,
};
export function webhookCallback(bot, framework = 'express', onTimeout = 'throw', timeoutMilliseconds = 10_000) {
    const server = frameworkAdapters[framework] ?? standard;
    let firstUpdate = true;
    let initialized = false;
    let initCall;
    return async (...args) => {
        const { update, respond } = server(...args);
        const webhookReplyEnvelope = {
            send: async (json) => {
                await respond(json);
            },
        };
        if (!initialized) {
            if (firstUpdate) {
                initCall = bot.init();
                firstUpdate = false;
            }
            await initCall;
            initialized = true;
        }
        await timeoutIfNecessary(bot.handleUpdate(update, webhookReplyEnvelope), typeof onTimeout === 'function'
            ? () => onTimeout(...args)
            : onTimeout, timeoutMilliseconds);
    };
}
function timeoutIfNecessary(task, onTimeout, timeout) {
    if (timeout === Infinity)
        return task;
    return new Promise((resolve, reject) => {
        const handle = setTimeout(() => {
            if (onTimeout === 'throw') {
                reject(new Error(`Request timed out after ${timeout} ms`));
            }
            else {
                if (typeof onTimeout === 'function')
                    onTimeout();
                resolve();
            }
            const now = Date.now();
            task.finally(() => {
                const diff = Date.now() - now;
                debugErr(`Request completed ${diff} ms after timeout!`);
            });
        }, timeout);
        task.then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(handle));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQVUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVuRCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUE7QUFvQmxDLE1BQU0sUUFBUSxHQUFxQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0NBQ2xDLENBQUMsQ0FBQTtBQUNGLE1BQU0sT0FBTyxHQUFxQixHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSTtJQUNwQixPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztDQUM5QyxDQUFDLENBQUE7QUFFRixNQUFNLGlCQUFpQixHQUFrRDtJQUNyRSxPQUFPLEVBQUUsUUFBUTtJQUNqQixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRSxRQUFRO0lBQ2YsR0FBRyxFQUFFLE9BQU87SUFDWixHQUFHLEVBQUUsT0FBTztJQUNaLE9BQU8sRUFBRSxRQUFRO0NBQ3BCLENBQUE7QUF1QkQsTUFBTSxVQUFVLGVBQWUsQ0FDM0IsR0FBUSxFQUNSLFlBQWlDLFNBQVMsRUFDMUMsWUFBZ0UsT0FBTyxFQUN2RSxtQkFBbUIsR0FBRyxNQUFNO0lBRTVCLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQTtJQUN2RCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFBO0lBQ3ZCLElBQUksUUFBbUMsQ0FBQTtJQUN2QyxPQUFPLEtBQUssRUFBRSxHQUFHLElBQVcsRUFBRSxFQUFFO1FBQzVCLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFDM0MsTUFBTSxvQkFBb0IsR0FBeUI7WUFDL0MsSUFBSSxFQUFFLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFBRTtnQkFDZixNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN2QixDQUFDO1NBQ0osQ0FBQTtRQUNELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDZCxJQUFJLFdBQVcsRUFBRTtnQkFDYixRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUNyQixXQUFXLEdBQUcsS0FBSyxDQUFBO2FBQ3RCO1lBQ0QsTUFBTSxRQUFRLENBQUE7WUFDZCxXQUFXLEdBQUcsSUFBSSxDQUFBO1NBQ3JCO1FBQ0QsTUFBTSxrQkFBa0IsQ0FDcEIsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsRUFDOUMsT0FBTyxTQUFTLEtBQUssVUFBVTtZQUMzQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxTQUFTLEVBQ2YsbUJBQW1CLENBQ3RCLENBQUE7SUFDTCxDQUFDLENBQUE7QUFDTCxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FDdkIsSUFBbUIsRUFDbkIsU0FBK0MsRUFDL0MsT0FBZTtJQUVmLElBQUksT0FBTyxLQUFLLFFBQVE7UUFBRSxPQUFPLElBQUksQ0FBQTtJQUNyQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsSUFBSSxTQUFTLEtBQUssT0FBTyxFQUFFO2dCQUN2QixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsMkJBQTJCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQTthQUM3RDtpQkFBTTtnQkFDSCxJQUFJLE9BQU8sU0FBUyxLQUFLLFVBQVU7b0JBQUUsU0FBUyxFQUFFLENBQUE7Z0JBQ2hELE9BQU8sRUFBRSxDQUFBO2FBQ1o7WUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7WUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtnQkFDN0IsUUFBUSxDQUFDLHFCQUFxQixJQUFJLG9CQUFvQixDQUFDLENBQUE7WUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNiLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFDYixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDNUMsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDIn0=