import { Type } from "../type.ts";
function reconstructFunction(code) {
    const func = new Function(`return ${code}`)();
    if (!(func instanceof Function)) {
        throw new TypeError(`Expected function but got ${typeof func}: ${code}`);
    }
    return func;
}
export const func = new Type("tag:yaml.org,2002:js/function", {
    kind: "scalar",
    resolve(data) {
        if (data === null) {
            return false;
        }
        try {
            reconstructFunction(`${data}`);
            return true;
        }
        catch (_err) {
            return false;
        }
    },
    construct(data) {
        return reconstructFunction(data);
    },
    predicate(object) {
        return object instanceof Function;
    },
    represent(object) {
        return object.toString();
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBS2xDLFNBQVMsbUJBQW1CLENBQUMsSUFBWTtJQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUM5QyxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksUUFBUSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLFNBQVMsQ0FBQyw2QkFBNkIsT0FBTyxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztLQUMxRTtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQywrQkFBK0IsRUFBRTtJQUM1RCxJQUFJLEVBQUUsUUFBUTtJQUNkLE9BQU8sQ0FBQyxJQUFTO1FBQ2YsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJO1lBQ0YsbUJBQW1CLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLElBQUksRUFBRTtZQUNiLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBQ0QsU0FBUyxDQUFDLElBQVk7UUFDcEIsT0FBTyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsU0FBUyxDQUFDLE1BQWU7UUFDdkIsT0FBTyxNQUFNLFlBQVksUUFBUSxDQUFDO0lBQ3BDLENBQUM7SUFDRCxTQUFTLENBQUMsTUFBK0I7UUFDdkMsT0FBTyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0IsQ0FBQztDQUNGLENBQUMsQ0FBQyJ9