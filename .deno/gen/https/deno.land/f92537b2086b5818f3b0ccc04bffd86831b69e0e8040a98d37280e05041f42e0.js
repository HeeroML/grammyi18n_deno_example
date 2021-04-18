import { getEncoding, } from "./_fs_common.ts";
import { Buffer } from "../buffer.ts";
import { fromFileUrl } from "../path.ts";
function maybeDecode(data, encoding) {
    const buffer = new Buffer(data.buffer, data.byteOffset, data.byteLength);
    if (encoding && encoding !== "binary")
        return buffer.toString(encoding);
    return buffer;
}
export function readFile(path, optOrCallback, callback) {
    path = path instanceof URL ? fromFileUrl(path) : path;
    let cb;
    if (typeof optOrCallback === "function") {
        cb = optOrCallback;
    }
    else {
        cb = callback;
    }
    const encoding = getEncoding(optOrCallback);
    const p = Deno.readFile(path);
    if (cb) {
        p.then((data) => {
            if (encoding && encoding !== "binary") {
                const text = maybeDecode(data, encoding);
                return cb(null, text);
            }
            const buffer = maybeDecode(data, encoding);
            cb(null, buffer);
        }, (err) => cb && cb(err));
    }
}
export function readFileSync(path, opt) {
    path = path instanceof URL ? fromFileUrl(path) : path;
    const data = Deno.readFileSync(path);
    const encoding = getEncoding(opt);
    if (encoding && encoding !== "binary") {
        const text = maybeDecode(data, encoding);
        return text;
    }
    const buffer = maybeDecode(data, encoding);
    return buffer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2ZzX3JlYWRGaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX2ZzX3JlYWRGaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFHTCxXQUFXLEdBRVosTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFRekMsU0FBUyxXQUFXLENBQ2xCLElBQWdCLEVBQ2hCLFFBQTBCO0lBRTFCLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekUsSUFBSSxRQUFRLElBQUksUUFBUSxLQUFLLFFBQVE7UUFBRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXVCRCxNQUFNLFVBQVUsUUFBUSxDQUN0QixJQUFrQixFQUNsQixhQUFpRSxFQUNqRSxRQUFtQjtJQUVuQixJQUFJLEdBQUcsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEQsSUFBSSxFQUF3QixDQUFDO0lBQzdCLElBQUksT0FBTyxhQUFhLEtBQUssVUFBVSxFQUFFO1FBQ3ZDLEVBQUUsR0FBRyxhQUFhLENBQUM7S0FDcEI7U0FBTTtRQUNMLEVBQUUsR0FBRyxRQUFRLENBQUM7S0FDZjtJQUVELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUU1QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlCLElBQUksRUFBRSxFQUFFO1FBQ04sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQWdCLEVBQUUsRUFBRTtZQUMxQixJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUNyQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxPQUFRLEVBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxQyxFQUFxQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUM1QjtBQUNILENBQUM7QUFVRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixJQUFrQixFQUNsQixHQUF5QjtJQUV6QixJQUFJLEdBQUcsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsSUFBSSxRQUFRLElBQUksUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUNyQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==