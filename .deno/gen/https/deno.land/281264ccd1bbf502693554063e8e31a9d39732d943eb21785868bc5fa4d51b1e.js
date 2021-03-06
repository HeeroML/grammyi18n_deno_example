import { fromFileUrl } from "../path.ts";
import { EventEmitter } from "../events.ts";
import { notImplemented } from "../_utils.ts";
export function asyncIterableIteratorToCallback(iterator, callback) {
    function next() {
        iterator.next().then((obj) => {
            if (obj.done) {
                callback(obj.value, true);
                return;
            }
            callback(obj.value);
            next();
        });
    }
    next();
}
export function asyncIterableToCallback(iter, callback) {
    const iterator = iter[Symbol.asyncIterator]();
    function next() {
        iterator.next().then((obj) => {
            if (obj.done) {
                callback(obj.value, true);
                return;
            }
            callback(obj.value);
            next();
        });
    }
    next();
}
export function watch(filename, optionsOrListener, optionsOrListener2) {
    const listener = typeof optionsOrListener === "function"
        ? optionsOrListener
        : typeof optionsOrListener2 === "function"
            ? optionsOrListener2
            : undefined;
    const options = typeof optionsOrListener === "object"
        ? optionsOrListener
        : typeof optionsOrListener2 === "object"
            ? optionsOrListener2
            : undefined;
    filename = filename instanceof URL ? fromFileUrl(filename) : filename;
    const iterator = Deno.watchFs(filename, {
        recursive: options?.recursive || false,
    });
    if (!listener)
        throw new Error("No callback function supplied");
    const fsWatcher = new FSWatcher(() => {
        if (iterator.return)
            iterator.return();
    });
    fsWatcher.on("change", listener);
    asyncIterableIteratorToCallback(iterator, (val, done) => {
        if (done)
            return;
        fsWatcher.emit("change", val.kind, val.paths[0]);
    });
    return fsWatcher;
}
class FSWatcher extends EventEmitter {
    constructor(closer) {
        super();
        this.close = closer;
    }
    ref() {
        notImplemented("FSWatcher.ref() is not implemented");
    }
    unref() {
        notImplemented("FSWatcher.unref() is not implemented");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2ZzX3dhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX2ZzX3dhdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTlDLE1BQU0sVUFBVSwrQkFBK0IsQ0FDN0MsUUFBa0MsRUFDbEMsUUFBMEM7SUFFMUMsU0FBUyxJQUFJO1FBQ1gsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzNCLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDWixRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUIsT0FBTzthQUNSO1lBQ0QsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixJQUFJLEVBQUUsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQztBQUVELE1BQU0sVUFBVSx1QkFBdUIsQ0FDckMsSUFBc0IsRUFDdEIsUUFBMEM7SUFFMUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0lBQzlDLFNBQVMsSUFBSTtRQUNYLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUMzQixJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFCLE9BQU87YUFDUjtZQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxJQUFJLEVBQUUsQ0FBQztBQUNULENBQUM7QUF3QkQsTUFBTSxVQUFVLEtBQUssQ0FDbkIsUUFBc0IsRUFDdEIsaUJBQWdELEVBQ2hELGtCQUFpRDtJQUVqRCxNQUFNLFFBQVEsR0FBRyxPQUFPLGlCQUFpQixLQUFLLFVBQVU7UUFDdEQsQ0FBQyxDQUFDLGlCQUFpQjtRQUNuQixDQUFDLENBQUMsT0FBTyxrQkFBa0IsS0FBSyxVQUFVO1lBQzFDLENBQUMsQ0FBQyxrQkFBa0I7WUFDcEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNkLE1BQU0sT0FBTyxHQUFHLE9BQU8saUJBQWlCLEtBQUssUUFBUTtRQUNuRCxDQUFDLENBQUMsaUJBQWlCO1FBQ25CLENBQUMsQ0FBQyxPQUFPLGtCQUFrQixLQUFLLFFBQVE7WUFDeEMsQ0FBQyxDQUFDLGtCQUFrQjtZQUNwQixDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2QsUUFBUSxHQUFHLFFBQVEsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBRXRFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ3RDLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxJQUFJLEtBQUs7S0FDdkMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFFBQVE7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFFaEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ25DLElBQUksUUFBUSxDQUFDLE1BQU07WUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVqQywrQkFBK0IsQ0FBZSxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDcEUsSUFBSSxJQUFJO1lBQUUsT0FBTztRQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxNQUFNLFNBQVUsU0FBUSxZQUFZO0lBRWxDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBQ0QsR0FBRztRQUNELGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFDRCxLQUFLO1FBQ0gsY0FBYyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNGIn0=