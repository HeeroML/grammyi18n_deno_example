export function session(options) {
    const getSessionKey = options?.getSessionKey ?? defaultGetSessionKey;
    const storage = options?.storage ?? new MemorySessionStorage();
    return async (ctx, next) => {
        const key = await getSessionKey(ctx);
        ctx.session = key === undefined ? undefined : await storage.read(key);
        await next();
        if (key !== undefined)
            if (!ctx.session)
                await storage.delete(key);
            else
                await storage.write(key, ctx.session);
    };
}
export function lazySession(options) {
    const getSessionKey = options?.getSessionKey ?? defaultGetSessionKey;
    const storage = options?.storage ?? new MemorySessionStorage();
    return async (ctx, next) => {
        const key = await getSessionKey(ctx);
        let session = undefined;
        let promise = undefined;
        let read = false;
        let write = false;
        Object.defineProperty(ctx, 'session', {
            get() {
                read = true;
                return (promise ??= Promise.resolve(key === undefined ? undefined : storage.read(key)).then(s => (session = s)));
            },
            set(newValue) {
                write = true;
                session = newValue;
            },
        });
        await next();
        if (key !== undefined) {
            if (read)
                await promise;
            if (read || write) {
                session = await session;
                if (session)
                    await storage.write(key, session);
                else
                    await storage.delete(key);
            }
        }
    };
}
function defaultGetSessionKey(ctx) {
    const userId = ctx.from?.id;
    if (userId === undefined)
        return undefined;
    const chatId = ctx.chat?.id;
    if (chatId === undefined)
        return undefined;
    return `${userId}:${chatId}`;
}
class MemorySessionStorage {
    constructor(timeToLive = Infinity) {
        this.timeToLive = timeToLive;
        this.storage = new Map();
    }
    read(key) {
        const value = this.storage.get(key);
        if (value === undefined)
            return undefined;
        if (value.expires !== undefined && value.expires < Date.now()) {
            this.delete(key);
            return undefined;
        }
        return value.session;
    }
    write(key, value) {
        this.storage.set(key, this.addExpiryDate(value));
    }
    addExpiryDate(value) {
        const ttl = this.timeToLive;
        if (ttl !== undefined && ttl < Infinity) {
            const now = Date.now();
            return { session: value, expires: now + ttl };
        }
        else {
            return { session: value };
        }
    }
    delete(key) {
        this.storage.delete(key);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUlBLE1BQU0sVUFBVSxPQUFPLENBQ25CLE9BQTJCO0lBRTNCLE1BQU0sYUFBYSxHQUFHLE9BQU8sRUFBRSxhQUFhLElBQUksb0JBQW9CLENBQUE7SUFDcEUsTUFBTSxPQUFPLEdBQUcsT0FBTyxFQUFFLE9BQU8sSUFBSSxJQUFJLG9CQUFvQixFQUFFLENBQUE7SUFDOUQsT0FBTyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDckUsTUFBTSxJQUFJLEVBQUUsQ0FBQTtRQUNaLElBQUksR0FBRyxLQUFLLFNBQVM7WUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPO2dCQUFFLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTs7Z0JBQ3RDLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQTtBQUNMLENBQUM7QUFrQ0QsTUFBTSxVQUFVLFdBQVcsQ0FDdkIsT0FBMkI7SUFFM0IsTUFBTSxhQUFhLEdBQUcsT0FBTyxFQUFFLGFBQWEsSUFBSSxvQkFBb0IsQ0FBQTtJQUNwRSxNQUFNLE9BQU8sR0FBRyxPQUFPLEVBQUUsT0FBTyxJQUFJLElBQUksb0JBQW9CLEVBQUUsQ0FBQTtJQUM5RCxPQUFPLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDdkIsTUFBTSxHQUFHLEdBQUcsTUFB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