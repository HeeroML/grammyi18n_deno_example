import { itrToStream, streamFile, InputFile, debug as d, } from '../platform.ts';
const debug = d('grammy:warn');
export function transformPayload(method, payload) {
    const entries = Object.entries(payload).map(kv => {
        const [key, value] = kv;
        if (mustSerialize(method, key)) {
            kv = [key, JSON.stringify(value)];
        }
        return kv;
    });
    return Object.fromEntries(entries);
}
export function requiresFormDataUpload(payload) {
    return (typeof payload === 'object' &&
        payload !== null &&
        Object.values(payload).some(v => Array.isArray(v)
            ? v.some(requiresFormDataUpload)
            : v instanceof InputFile || requiresFormDataUpload(v)));
}
export function createJsonPayload(payload) {
    return {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            connection: 'keep-alive',
        },
        body: JSON.stringify(payload, (_, v) => v ?? undefined),
    };
}
export function createFormDataPayload(payload) {
    const boundary = createBoundary();
    return {
        method: 'POST',
        headers: {
            'content-type': `multipart/form-data; boundary=${boundary}`,
            connection: 'keep-alive',
        },
        body: itrToStream(payloadToMultipartItr(payload, boundary)),
    };
}
function createBoundary() {
    return '----------' + randomId(32);
}
function randomId(length = 16) {
    return Array.from(Array(length))
        .map(() => Math.random().toString(36)[2] || 0)
        .join('');
}
const enc = new TextEncoder();
async function* payloadToMultipartItr(payload, boundary = createBoundary()) {
    yield enc.encode(`--${boundary}\r\n`);
    const separator = enc.encode(`\r\n--${boundary}\r\n`);
    let first = true;
    for (const [key, value] of Object.entries(payload)) {
        if (!first)
            yield separator;
        if (value instanceof InputFile) {
            if (mustAttachIndirectly(key)) {
                const id = randomId();
                yield* filePart(id, key, value);
                yield valuePart(key, `attach://${id}`);
            }
            else {
                yield* filePart(key, key, value);
            }
        }
        else if (isInputMedia(value)) {
            if (value.media instanceof InputFile) {
                const id = randomId();
                yield* filePart(id, key, value.media);
                value.media = `attach://${id}`;
            }
            yield valuePart(key, JSON.stringify(value));
        }
        else if (Array.isArray(value)) {
            for (const elem of value) {
                if (isInputMedia(elem) && elem.media instanceof InputFile) {
                    const id = randomId();
                    yield* filePart(id, key, elem.media);
                    yield separator;
                    elem.media = `attach://${id}`;
                }
            }
            yield valuePart(key, JSON.stringify(value));
        }
        else {
            yield valuePart(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
        first = false;
    }
    yield enc.encode(`\r\n--${boundary}--`);
}
function valuePart(key, value) {
    return enc.encode(`content-disposition:form-data;name="${key}"\r\n\r\n${value}`);
}
async function* filePart(id, key, input) {
    const filename = input.filename ?? `${key}.${getExt(key)}`;
    if (filename.includes(';') || filename.includes('"')) {
        debug('WARNING: Telegram Bot API currently does not support');
        debug('sending filenames that contain semicolons or double quotes');
        debug('(or both), confer https://github.com/tdlib/td/issues/1459.');
        debug('While grammY will send the correct data, the Telegram');
        debug('Bot API will discard everything after the first semicolon,');
        debug('and it will convert the double quotes into spaces.');
    }
    yield enc.encode(`content-disposition:form-data;name="${id}";filename=${filename}\r\n\r\n`);
    if (input.file instanceof Uint8Array) {
        yield input.file;
    }
    else {
        const stream = typeof input.file === 'string'
            ? await streamFile(input.file)
            : input.file;
        for await (const chunk of stream)
            yield chunk;
    }
}
function getExt(key) {
    switch (key) {
        case 'photo':
            return 'jpg';
        case 'voice':
            return 'ogg';
        case 'audio':
            return 'mp3';
        case 'animation':
        case 'video':
        case 'video_note':
            return 'mp4';
        case 'sticker':
            return 'webp';
        default:
            return 'dat';
    }
}
const serializationFields = new Set([
    'allowed_updates',
    'reply_markup',
    'options',
    'commands',
    'mask_position',
    'results',
    'prices',
    'shipping_options',
    'errors',
]);
const serializationMethodFields = new Set(['restrictChatMember:permissions']);
function mustSerialize(method, key) {
    return (serializationFields.has(key) ||
        serializationMethodFields.has(`${method}:${key}`));
}
const indirectAttachmentFields = new Set(['thumb']);
function mustAttachIndirectly(key) {
    return indirectAttachmentFields.has(key);
}
function has(obj, props) {
    return typeof obj === 'object' && obj !== null && props.every(p => p in obj);
}
const inputMediaProps = ['type', 'media'];
function isInputMedia(value) {
    return (has(value, inputMediaProps) &&
        typeof value.type === 'string' &&
        (typeof value.media === 'string' || value.media instanceof InputFile));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBheWxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxVQUFVLEVBQ1YsU0FBUyxFQUVULEtBQUssSUFBSSxDQUFDLEdBQ2IsTUFBTSxnQkFBZ0IsQ0FBQTtBQUN2QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUE7QUFPOUIsTUFBTSxVQUFVLGdCQUFnQixDQUM1QixNQUFjLEVBQ2QsT0FBZ0M7SUFFaEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDdkIsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7U0FDcEM7UUFDRCxPQUFPLEVBQUUsQ0FBQTtJQUNiLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3RDLENBQUM7QUFVRCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsT0FBZ0I7SUFDbkQsT0FBTyxDQUNILE9BQU8sT0FBTyxLQUFLLFFBQVE7UUFDM0IsT0FBTyxLQUFLLElBQUk7UUFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQyxZQUFZLFNBQVMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FDSixDQUFBO0FBQ0wsQ0FBQztBQVFELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxPQUFnQztJQUM5RCxPQUFPO1FBQ0gsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUU7WUFDTCxjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLFVBQVUsRUFBRSxZQUFZO1NBQzNCO1FBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztLQUMxRCxDQUFBO0FBQ0wsQ0FBQztBQVNELE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxPQUFnQztJQUNsRSxNQUFNLFFBQVEsR0FBRyxjQUFjLEVBQUUsQ0FBQTtJQUVqQyxPQUFPO1FBQ0gsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUU7WUFDTCxjQUFjLEVBQUUsaUNBQWlDLFFBQVEsRUFBRTtZQUMzRCxVQUFVLEVBQUUsWUFBWTtTQUMzQjtRQUNELElBQUksRUFBRSxXQUFXLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzlELENBQUE7QUFDTCxDQUFDO0FBR0QsU0FBUyxjQUFjO0lBRW5CLE9BQU8sWUFBWSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN0QyxDQUFDO0FBQ0QsU0FBUyxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUU7SUFDekIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2pCLENBQUM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFBO0FBQzdCLEtBQUssU0FBUyxDQUFDLENBQUMscUJBQXFCLENBQ2pDLE9BQWdDLEVBQ2hDLFFBQVEsR0FBRyxjQUFjLEVBQUU7SUFFM0IsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxNQUFNLENBQUMsQ0FBQTtJQUVyQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsUUFBUSxNQUFNLENBQUMsQ0FBQTtJQUNyRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7SUFDaEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDaEQsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLFNBQVMsQ0FBQTtRQUMzQixJQUFJLEtBQUssWUFBWSxTQUFTLEVBQUU7WUFFNUIsSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUE7Z0JBQ3JCLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO2dCQUMvQixNQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFBO2FBQ3pDO2lCQUFNO2dCQUNILEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO2FBQ25DO1NBQ0o7YUFBTSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUU1QixJQUFJLEtBQUssQ0FBQyxLQUFLLFlBQVksU0FBUyxFQUFFO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQTtnQkFDckIsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNyQyxLQUFLLENBQUMsS0FBSyxHQUFHLFlBQVksRUFBRSxFQUFFLENBQUE7YUFDakM7WUFDRCxNQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1NBQzlDO2FBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBRTdCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO2dCQUN0QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLFNBQVMsRUFBRTtvQkFDdkQsTUFBTSxFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUE7b0JBQ3JCLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDcEMsTUFBTSxTQUFTLENBQUE7b0JBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLEVBQUUsRUFBRSxDQUFBO2lCQUNoQzthQUNKO1lBQ0QsTUFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtTQUM5QzthQUFNO1lBRUgsTUFBTSxTQUFTLENBQ1gsR0FBRyxFQUNILE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUM1RCxDQUFBO1NBQ0o7UUFDRCxLQUFLLEdBQUcsS0FBSyxDQUFBO0tBQ2hCO0lBRUQsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsUUFBUSxJQUFJLENBQUMsQ0FBQTtBQUMzQyxDQUFDO0FBR0QsU0FBUyxTQUFTLENBQUMsR0FBVyxFQUFFLEtBQWM7SUFDMUMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUNiLHVDQUF1QyxHQUFHLFlBQVksS0FBSyxFQUFFLENBQ2hFLENBQUE7QUFDTCxDQUFDO0FBRUQsS0FBSyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQ3BCLEVBQVUsRUFDVixHQUFXLEVBQ1gsS0FBZ0I7SUFFaEIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQTtJQUMxRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsRCxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQTtRQUM3RCxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQTtRQUNuRSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQTtRQUNuRSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQTtRQUM5RCxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQTtRQUNuRSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtLQUM5RDtJQUNELE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FDWix1Q0FBdUMsRUFBRSxjQUFjLFFBQVEsVUFBVSxDQUM1RSxDQUFBO0lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxZQUFZLFVBQVUsRUFBRTtRQUVsQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUE7S0FDbkI7U0FBTTtRQUNILE1BQU0sTUFBTSxHQUNSLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRO1lBQzFCLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO1FBQ3BCLElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxJQUFJLE1BQU07WUFBRSxNQUFNLEtBQUssQ0FBQTtLQUNoRDtBQUNMLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxHQUFXO0lBQ3ZCLFFBQVEsR0FBRyxFQUFFO1FBQ1QsS0FBSyxPQUFPO1lBQ1IsT0FBTyxLQUFLLENBQUE7UUFDaEIsS0FBSyxPQUFPO1lBQ1IsT0FBTyxLQUFLLENBQUE7UUFDaEIsS0FBSyxPQUFPO1lBQ1IsT0FBTyxLQUFLLENBQUE7UUFDaEIsS0FBSyxXQUFXLENBQUM7UUFDakIsS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLFlBQVk7WUFDYixPQUFPLEtBQUssQ0FBQTtRQUNoQixLQUFLLFNBQVM7WUFDVixPQUFPLE1BQU0sQ0FBQTtRQUNqQjtZQUNJLE9BQU8sS0FBSyxDQUFBO0tBQ25CO0FBQ0wsQ0FBQztBQUlELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDaEMsaUJBQWlCO0lBQ2pCLGNBQWM7SUFDZCxTQUFTO0lBQ1QsVUFBVTtJQUNWLGVBQWU7SUFDZixTQUFTO0lBQ1QsUUFBUTtJQUNSLGtCQUFrQjtJQUNsQixRQUFRO0NBQ1gsQ0FBQyxDQUFBO0FBRUYsTUFBTSx5QkFBeUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQTtBQUU3RSxTQUFTLGFBQWEsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUM5QyxPQUFPLENBQ0gsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUM1Qix5QkFBeUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsQ0FDcEQsQ0FBQTtBQUNMLENBQUM7QUFFRCxNQUFNLHdCQUF3QixHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUVuRCxTQUFTLG9CQUFvQixDQUFDLEdBQVc7SUFDckMsT0FBTyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDNUMsQ0FBQztBQUNELFNBQVMsR0FBRyxDQUNSLEdBQVksRUFDWixLQUFRO0lBRVIsT0FBTyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFBO0FBQ2hGLENBQUM7QUFDRCxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQVUsQ0FBQTtBQUVsRCxTQUFTLFlBQVksQ0FBQyxLQUFjO0lBQ2hDLE9BQU8sQ0FDSCxHQUFHLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUTtRQUM5QixDQUFDLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLEtBQUssWUFBWSxTQUFTLENBQUMsQ0FDeEUsQ0FBQTtBQUNMLENBQUMifQ==