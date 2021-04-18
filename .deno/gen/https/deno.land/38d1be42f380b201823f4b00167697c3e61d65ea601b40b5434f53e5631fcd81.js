import { existsSync } from "../../fs/exists.ts";
import { fromFileUrl } from "../path.ts";
import { getOpenOptions } from "./_fs_common.ts";
function convertFlagAndModeToOptions(flag, mode) {
    if (!flag && !mode)
        return undefined;
    if (!flag && mode)
        return { mode };
    return { ...getOpenOptions(flag), mode };
}
export function open(path, flagsOrCallback, callbackOrMode, maybeCallback) {
    const flags = typeof flagsOrCallback === "string"
        ? flagsOrCallback
        : undefined;
    const callback = typeof flagsOrCallback === "function"
        ? flagsOrCallback
        : typeof callbackOrMode === "function"
            ? callbackOrMode
            : maybeCallback;
    const mode = typeof callbackOrMode === "number" ? callbackOrMode : undefined;
    path = path instanceof URL ? fromFileUrl(path) : path;
    if (!callback)
        throw new Error("No callback function supplied");
    if (["ax", "ax+", "wx", "wx+"].includes(flags || "") && existsSync(path)) {
        const err = new Error(`EEXIST: file already exists, open '${path}'`);
        callback(err);
    }
    else {
        if (flags === "as" || flags === "as+") {
            let err = null, res;
            try {
                res = openSync(path, flags, mode);
            }
            catch (error) {
                err = error;
            }
            if (err) {
                callback(err);
            }
            else {
                callback(null, res);
            }
            return;
        }
        Deno.open(path, convertFlagAndModeToOptions(flags, mode)).then((file) => callback(null, file.rid), (err) => callback(err));
    }
}
export function openSync(path, flagsOrMode, maybeMode) {
    const flags = typeof flagsOrMode === "string" ? flagsOrMode : undefined;
    const mode = typeof flagsOrMode === "number" ? flagsOrMode : maybeMode;
    path = path instanceof URL ? fromFileUrl(path) : path;
    if (["ax", "ax+", "wx", "wx+"].includes(flags || "") && existsSync(path)) {
        throw new Error(`EEXIST: file already exists, open '${path}'`);
    }
    return Deno.openSync(path, convertFlagAndModeToOptions(flags, mode)).rid;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2ZzX29wZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJfZnNfb3Blbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFtQmpELFNBQVMsMkJBQTJCLENBQ2xDLElBQWdCLEVBQ2hCLElBQWE7SUFFYixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSTtRQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNuQyxPQUFPLEVBQUUsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDM0MsQ0FBQztBQWNELE1BQU0sVUFBVSxJQUFJLENBQ2xCLElBQWtCLEVBQ2xCLGVBQXlDLEVBQ3pDLGNBQXNDLEVBQ3RDLGFBQTRCO0lBRTVCLE1BQU0sS0FBSyxHQUFHLE9BQU8sZUFBZSxLQUFLLFFBQVE7UUFDL0MsQ0FBQyxDQUFDLGVBQWU7UUFDakIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNkLE1BQU0sUUFBUSxHQUFHLE9BQU8sZUFBZSxLQUFLLFVBQVU7UUFDcEQsQ0FBQyxDQUFDLGVBQWU7UUFDakIsQ0FBQyxDQUFDLE9BQU8sY0FBYyxLQUFLLFVBQVU7WUFDdEMsQ0FBQyxDQUFDLGNBQWM7WUFDaEIsQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUNsQixNQUFNLElBQUksR0FBRyxPQUFPLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzdFLElBQUksR0FBRyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFB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