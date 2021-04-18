import { Type } from "../type.ts";
function resolveYamlNull(data) {
    const max = data.length;
    return ((max === 1 && data === "~") ||
        (max === 4 && (data === "null" || data === "Null" || data === "NULL")));
}
function constructYamlNull() {
    return null;
}
function isNull(object) {
    return object === null;
}
export const nil = new Type("tag:yaml.org,2002:null", {
    construct: constructYamlNull,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isNull,
    represent: {
        canonical() {
            return "~";
        },
        lowercase() {
            return "null";
        },
        uppercase() {
            return "NULL";
        },
        camelcase() {
            return "Null";
        },
    },
    resolve: resolveYamlNull,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFbEMsU0FBUyxlQUFlLENBQUMsSUFBWTtJQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBRXhCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQztRQUMzQixDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQ3ZFLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxpQkFBaUI7SUFDeEIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsTUFBZTtJQUM3QixPQUFPLE1BQU0sS0FBSyxJQUFJLENBQUM7QUFDekIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtJQUNwRCxTQUFTLEVBQUUsaUJBQWlCO0lBQzVCLFlBQVksRUFBRSxXQUFXO0lBQ3pCLElBQUksRUFBRSxRQUFRO0lBQ2QsU0FBUyxFQUFFLE1BQU07SUFDakIsU0FBUyxFQUFFO1FBQ1QsU0FBUztZQUNQLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELFNBQVM7WUFDUCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBQ0QsU0FBUztZQUNQLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxTQUFTO1lBQ1AsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztLQUNGO0lBQ0QsT0FBTyxFQUFFLGVBQWU7Q0FDekIsQ0FBQyxDQUFDIn0=