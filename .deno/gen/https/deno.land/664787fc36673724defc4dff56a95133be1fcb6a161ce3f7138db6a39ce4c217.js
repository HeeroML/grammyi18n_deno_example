import processModule from "./process.ts";
import { Buffer as bufferModule } from "./buffer.ts";
import timers from "./timers.ts";
Object.defineProperty(globalThis, "global", {
    value: globalThis,
    writable: false,
    enumerable: false,
    configurable: true,
});
Object.defineProperty(globalThis, "process", {
    value: processModule,
    enumerable: false,
    writable: true,
    configurable: true,
});
Object.defineProperty(globalThis, "Buffer", {
    value: bufferModule,
    enumerable: false,
    writable: true,
    configurable: true,
});
Object.defineProperty(globalThis, "setImmediate", {
    value: timers.setImmediate,
    enumerable: true,
    writable: true,
    configurable: true,
});
Object.defineProperty(globalThis, "clearImmediate", {
    value: timers.clearImmediate,
    enumerable: true,
    writable: true,
    configurable: true,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xvYmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sYUFBYSxNQUFNLGNBQWMsQ0FBQztBQUN6QyxPQUFPLEVBQUUsTUFBTSxJQUFJLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyRCxPQUFPLE1BQU0sTUFBTSxhQUFhLENBQUM7QUFFakMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQzFDLEtBQUssRUFBRSxVQUFVO0lBQ2pCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsVUFBVSxFQUFFLEtBQUs7SUFDakIsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO0lBQzNDLEtBQUssRUFBRSxhQUFhO0lBQ3BCLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFO0lBQzFDLEtBQUssRUFBRSxZQUFZO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFO0lBQ2hELEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWTtJQUMxQixVQUFVLEVBQUUsSUFBSTtJQUNoQixRQUFRLEVBQUUsSUFBSTtJQUNkLFlBQVksRUFBRSxJQUFJO0NBQ25CLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFO0lBQ2xELEtBQUssRUFBRSxNQUFNLENBQUMsY0FBYztJQUM1QixVQUFVLEVBQUUsSUFBSTtJQUNoQixRQUFRLEVBQUUsSUFBSTtJQUNkLFlBQVksRUFBRSxJQUFJO0NBQ25CLENBQUMsQ0FBQyJ9