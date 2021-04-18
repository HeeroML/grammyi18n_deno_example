import { Type } from "../type.ts";
export const undefinedType = new Type("tag:yaml.org,2002:js/undefined", {
    kind: "scalar",
    resolve() {
        return true;
    },
    construct() {
        return undefined;
    },
    predicate(object) {
        return typeof object === "undefined";
    },
    represent() {
        return "";
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5kZWZpbmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidW5kZWZpbmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFbEMsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLGdDQUFnQyxFQUFFO0lBQ3RFLElBQUksRUFBRSxRQUFRO0lBQ2QsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFNBQVM7UUFDUCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsU0FBUyxDQUFDLE1BQU07UUFDZCxPQUFPLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsU0FBUztRQUNQLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGLENBQUMsQ0FBQyJ9