import { Type } from "../type.ts";
import { isNegativeZero } from "../utils.ts";
const YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?" +
    "|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?" +
    "|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*" +
    "|[-+]?\\.(?:inf|Inf|INF)" +
    "|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(data) {
    if (!YAML_FLOAT_PATTERN.test(data) ||
        data[data.length - 1] === "_") {
        return false;
    }
    return true;
}
function constructYamlFloat(data) {
    let value = data.replace(/_/g, "").toLowerCase();
    const sign = value[0] === "-" ? -1 : 1;
    const digits = [];
    if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
    }
    if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (value === ".nan") {
        return NaN;
    }
    if (value.indexOf(":") >= 0) {
        value.split(":").forEach((v) => {
            digits.unshift(parseFloat(v));
        });
        let valueNb = 0.0;
        let base = 1;
        digits.forEach((d) => {
            valueNb += d * base;
            base *= 60;
        });
        return sign * valueNb;
    }
    return sign * parseFloat(value);
}
const SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
    if (isNaN(object)) {
        switch (style) {
            case "lowercase":
                return ".nan";
            case "uppercase":
                return ".NAN";
            case "camelcase":
                return ".NaN";
        }
    }
    else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
            case "lowercase":
                return ".inf";
            case "uppercase":
                return ".INF";
            case "camelcase":
                return ".Inf";
        }
    }
    else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
            case "lowercase":
                return "-.inf";
            case "uppercase":
                return "-.INF";
            case "camelcase":
                return "-.Inf";
        }
    }
    else if (isNegativeZero(object)) {
        return "-0.0";
    }
    const res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
    return (Object.prototype.toString.call(object) === "[object Number]" &&
        (object % 1 !== 0 || isNegativeZero(object)));
}
export const float = new Type("tag:yaml.org,2002:float", {
    construct: constructYamlFloat,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isFloat,
    represent: representYamlFloat,
    resolve: resolveYamlFloat,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmbG9hdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxPQUFPLEVBQWdCLElBQUksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNoRCxPQUFPLEVBQUUsY0FBYyxFQUFPLE1BQU0sYUFBYSxDQUFDO0FBRWxELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBRW5DLGdFQUFnRTtJQUc5RCxpQ0FBaUM7SUFFakMsK0NBQStDO0lBRS9DLDBCQUEwQjtJQUUxQix1QkFBdUIsQ0FDMUIsQ0FBQztBQUVGLFNBQVMsZ0JBQWdCLENBQUMsSUFBWTtJQUNwQyxJQUNFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUc5QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQzdCO1FBQ0EsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBWTtJQUN0QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNqRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUU1QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQy9CLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO0lBRUQsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQ3BCLE9BQU8sSUFBSSxLQUFLLENBQUMs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