function getConsoleWidth() {
    return Deno.consoleSize?.(Deno.stderr.rid).columns ?? 80;
}
import { inspect } from "./util.ts";
import { stripColor as removeColors } from "../fmt/colors.ts";
const MathMax = Math.max;
const { Error } = globalThis;
const { create: ObjectCreate, defineProperty: ObjectDefineProperty, getPrototypeOf: ObjectGetPrototypeOf, getOwnPropertyDescriptor: ObjectGetOwnPropertyDescriptor, keys: ObjectKeys, } = Object;
import { ERR_INVALID_ARG_TYPE } from "./_errors.ts";
let blue = "";
let green = "";
let red = "";
let defaultColor = "";
const kReadableOperator = {
    deepStrictEqual: "Expected values to be strictly deep-equal:",
    strictEqual: "Expected values to be strictly equal:",
    strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
    deepEqual: "Expected values to be loosely deep-equal:",
    notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
    notStrictEqual: 'Expected "actual" to be strictly unequal to:',
    notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
    notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
    notIdentical: "Values have same structure but are not reference-equal:",
    notDeepEqualUnequal: "Expected values not to be loosely deep-equal:",
};
const kMaxShortLength = 12;
export function copyError(source) {
    const keys = ObjectKeys(source);
    const target = ObjectCreate(ObjectGetPrototypeOf(source));
    for (const key of keys) {
        const desc = ObjectGetOwnPropertyDescriptor(source, key);
        if (desc !== undefined) {
            ObjectDefineProperty(target, key, desc);
        }
    }
    ObjectDefineProperty(target, "message", { value: source.message });
    return target;
}
export function inspectValue(val) {
    return inspect(val, {
        compact: false,
        customInspect: false,
        depth: 1000,
        maxArrayLength: Infinity,
        showHidden: false,
        showProxy: false,
        sorted: true,
        getters: true,
    });
}
export function createErrDiff(actual, expected, operator) {
    let other = "";
    let res = "";
    let end = "";
    let skipped = false;
    const actualInspected = inspectValue(actual);
    const actualLines = actualInspected.split("\n");
    const expectedLines = inspectValue(expected).split("\n");
    let i = 0;
    let indicator = "";
    if (operator === "strictEqual" &&
        ((typeof actual === "object" && actual !== null &&
            typeof expected === "object" && expected !== null) ||
            (typeof actual === "function" && typeof expected === "function"))) {
        operator = "strictEqualObject";
    }
    if (actualLines.length === 1 && expectedLines.length === 1 &&
        actualLines[0] !== expectedLines[0]) {
        const c = inspect.defaultOptions.colors;
        const actualRaw = c ? removeColors(actualLines[0]) : actualLines[0];
        const expectedRaw = c ? removeColors(expectedLines[0]) : expectedLines[0];
        const inputLength = actualRaw.length + expectedRaw.length;
        if (inputLength <= kMaxShortLength) {
            if ((typeof actual !== "object" || actual === null) &&
                (typeof expected !== "object" || expected === null) &&
                (actual !== 0 || expected !== 0)) {
                return `${kReadableOperator[operator]}\n\n` +
                    `${actualLines[0]} !== ${expectedLines[0]}\n`;
            }
        }
        else if (operator !== "strictEqualObject") {
            const maxLength = Deno.isatty(Deno.stderr.rid) ? getConsoleWidth() : 80;
            if (inputLength < maxLength) {
                while (actualRaw[i] === expectedRaw[i]) {
                    i++;
                }
                if (i > 2) {
                    indicator = `\n  ${" ".repeat(i)}^`;
                    i = 0;
                }
            }
        }
    }
    let a = actualLines[actualLines.length - 1];
    let b = expectedLines[expectedLines.length - 1];
    while (a === b) {
        if (i++ < 3) {
            end = `\n  ${a}${end}`;
        }
        else {
            other = a;
        }
        actualLines.pop();
        expectedLines.pop();
        if (actualLines.length === 0 || expectedLines.length === 0) {
            break;
        }
        a = actualLines[actualLines.length - 1];
        b = expectedLines[expectedLines.length - 1];
    }
    const maxLines = MathMax(actualLines.length, expectedLines.length);
    if (maxLines === 0) {
        const actualLines = actualInspected.split("\n");
        if (actualLines.length > 50) {
            actualLines[46] = `${blue}...${defaultColor}`;
            while (actualLines.length > 47) {
                actualLines.pop();
            }
        }
        return `${kReadableOperator.notIdentical}\n\n${actualLines.join("\n")}\n`;
    }
    if (i >= 5) {
        end = `\n${blue}...${defaultColor}${end}`;
        skipped = true;
    }
    if (other !== "") {
        end = `\n  ${other}${end}`;
        other = "";
    }
    let printedLines = 0;
    let identical = 0;
    const msg = kReadableOperator[operator] +
        `\n${green}+ actual${defaultColor} ${red}- expected${defaultColor}`;
    const skippedMsg = ` ${blue}...${defaultColor} Lines skipped`;
    let lines = actualLines;
    let plusMinus = `${green}+${defaultColor}`;
    let maxLength = expectedLines.length;
    if (actualLines.length < maxLines) {
        lines = expectedLines;
        plusMinus = `${red}-${defaultColor}`;
        maxLength = actualLines.length;
    }
    for (i = 0; i < maxLines; i++) {
        if (maxLength < i + 1) {
            if (identical > 2) {
                if (identical > 3) {
                    if (identical > 4) {
                        if (identical === 5) {
                            res += `\n  ${lines[i - 3]}`;
                            printedLines++;
                        }
                        else {
                            res += `\n${blue}...${defaultColor}`;
                            skipped = true;
                        }
                    }
                    res += `\n  ${lines[i - 2]}`;
                    printedLines++;
                }
                res += `\n  ${lines[i - 1]}`;
                printedLines++;
            }
            identical = 0;
            if (lines === actualLines) {
                res += `\n${plusMinus} ${lines[i]}`;
            }
            else {
                other += `\n${plusMinus} ${lines[i]}`;
            }
            printedLines++;
        }
        else {
            const expectedLine = expectedLines[i];
            let actualLine = actualLines[i];
            let divergingLines = actualLine !== expectedLine &&
                (!actualLine.endsWith(",") ||
                    actualLine.slice(0, -1) !== expectedLine);
            if (divergingLines &&
                expectedLine.endsWith(",") &&
                expectedLine.slice(0, -1) === actualLine) {
                divergingLines = false;
                actualLine += ",";
            }
            if (divergingLines) {
                if (identical > 2) {
                    if (identical > 3) {
                        if (identical > 4) {
                            if (identical === 5) {
                                res += `\n  ${actualLines[i - 3]}`;
                                printedLines++;
                            }
                            else {
                                res += `\n${blue}...${defaultColor}`;
                                skipped = true;
                            }
                        }
                        res += `\n  ${actualLines[i - 2]}`;
                        printedLines++;
                    }
                    res += `\n  ${actualLines[i - 1]}`;
                    printedLines++;
                }
                identical = 0;
                res += `\n${green}+${defaultColor} ${actualLine}`;
                other += `\n${red}-${defaultColor} ${expectedLine}`;
                printedLines += 2;
            }
            else {
                res += other;
                other = "";
                identical++;
                if (identical <= 2) {
                    res += `\n  ${actualLine}`;
                    printedLines++;
                }
            }
        }
        if (printedLines > 50 && i < maxLines - 2) {
            return `${msg}${skippedMsg}\n${res}\n${blue}...${defaultColor}${other}\n` +
                `${blue}...${defaultColor}`;
        }
    }
    return `${msg}${skipped ? skippedMsg : ""}\n${res}${other}${end}${indicator}`;
}
export class AssertionError extends Error {
    constructor(options) {
        if (typeof options !== "object" || options === null) {
            throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
        }
        const { message, operator, stackStartFn, details, stackStartFunction, } = options;
        let { actual, expected, } = options;
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        if (message != null) {
            super(String(message));
        }
        else {
            if (Deno.isatty(Deno.stderr.rid)) {
                if (Deno.noColor) {
                    blue = "";
                    green = "";
                    defaultColor = "";
                    red = "";
                }
                else {
                    blue = "\u001b[34m";
                    green = "\u001b[32m";
                    defaultColor = "\u001b[39m";
                    red = "\u001b[31m";
                }
            }
            if (typeof actual === "object" && actual !== null &&
                typeof expected === "object" && expected !== null &&
                "stack" in actual && actual instanceof Error &&
                "stack" in expected && expected instanceof Error) {
                actual = copyError(actual);
                expected = copyError(expected);
            }
            if (operator === "deepStrictEqual" || operator === "strictEqual") {
                super(createErrDiff(actual, expected, operator));
            }
            else if (operator === "notDeepStrictEqual" ||
                operator === "notStrictEqual") {
                let base = kReadableOperator[operator];
                const res = inspectValue(actual).split("\n");
                if (operator === "notStrictEqual" &&
                    ((typeof actual === "object" && actual !== null) ||
                        typeof actual === "function")) {
                    base = kReadableOperator.notStrictEqualObject;
                }
                if (res.length > 50) {
                    res[46] = `${blue}...${defaultColor}`;
                    while (res.length > 47) {
                        res.pop();
                    }
                }
                if (res.length === 1) {
                    super(`${base}${res[0].length > 5 ? "\n\n" : " "}${res[0]}`);
                }
                else {
                    super(`${base}\n\n${res.join("\n")}\n`);
                }
            }
            else {
                let res = inspectValue(actual);
                let other = inspectValue(expected);
                const knownOperator = kReadableOperator[operator ?? ""];
                if (operator === "notDeepEqual" && res === other) {
                    res = `${knownOperator}\n\n${res}`;
                    if (res.length > 1024) {
                        res = `${res.slice(0, 1021)}...`;
                    }
                    super(res);
                }
                else {
                    if (res.length > 512) {
                        res = `${res.slice(0, 509)}...`;
                    }
                    if (other.length > 512) {
                        other = `${other.slice(0, 509)}...`;
                    }
                    if (operator === "deepEqual") {
                        res = `${knownOperator}\n\n${res}\n\nshould loosely deep-equal\n\n`;
                    }
                    else {
                        const newOp = kReadableOperator[`${operator}Unequal`];
                        if (newOp) {
                            res = `${newOp}\n\n${res}\n\nshould not loosely deep-equal\n\n`;
                        }
                        else {
                            other = ` ${operator} ${other}`;
                        }
                    }
                    super(`${res}${other}`);
                }
            }
        }
        Error.stackTraceLimit = limit;
        this.generatedMessage = !message;
        ObjectDefineProperty(this, "name", {
            value: "AssertionError [ERR_ASSERTION]",
            enumerable: false,
            writable: true,
            configurable: true,
        });
        this.code = "ERR_ASSERTION";
        if (details) {
            this.actual = undefined;
            this.expected = undefined;
            this.operator = undefined;
            for (let i = 0; i < details.length; i++) {
                this["message " + i] = details[i].message;
                this["actual " + i] = details[i].actual;
                this["expected " + i] = details[i].expected;
                this["operator " + i] = details[i].operator;
                this["stack trace " + i] = details[i].stack;
            }
        }
        else {
            this.actual = actual;
            this.expected = expected;
            this.operator = operator;
        }
        Error.captureStackTrace(this, stackStartFn || stackStartFunction);
        this.stack;
        this.name = "AssertionError";
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
    [inspect.custom](_recurseTimes, ctx) {
        const tmpActual = this.actual;
        const tmpExpected = this.expected;
        for (const name of ["actual", "expected"]) {
            if (typeof this[name] === "string") {
                const value = this[name];
                const lines = value.split("\n");
                if (lines.length > 10) {
                    lines.length = 10;
                    this[name] = `${lines.join("\n")}\n...`;
                }
                else if (value.length > 512) {
                    this[name] = `${value.slice(512)}...`;
                }
            }
        }
        const result = inspect(this, {
            ...ctx,
            customInspect: false,
            depth: 0,
        });
        this.actual = tmpActual;
        this.expected = tmpExpected;
        return result;
    }
}
export default AssertionError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0aW9uX2Vycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXNzZXJ0aW9uX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTJCQSxTQUFTLGVBQWU7SUFDdEIsT0FBUSxJQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUM3RSxDQUFDO0FBRUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUUsVUFBVSxJQUFJLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBSTlELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDekIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFNLEVBQ0osTUFBTSxFQUFFLFlBQVksRUFDcEIsY0FBYyxFQUFFLG9CQUFvQixFQUNwQyxjQUFjLEVBQUUsb0JBQW9CLEVBQ3BDLHdCQUF3QixFQUFFLDhCQUE4QixFQUN4RCxJQUFJLEVBQUUsVUFBVSxHQUNqQixHQUFHLE1BQU0sQ0FBQztBQUVYLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVwRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxpQkFBaUIsR0FBOEI7SUFDbkQsZUFBZSxFQUFFLDRDQUE0QztJQUM3RCxXQUFXLEVBQUUsdUNBQXVDO0lBQ3BELGlCQUFpQixFQUFFLHdEQUF3RDtJQUMzRSxTQUFTLEVBQUUsMkNBQTJDO0lBQ3RELGtCQUFrQixFQUFFLHFEQUFxRDtJQUN6RSxjQUFjLEVBQUUsOENBQThDO0lBQzlELG9CQUFvQixFQUNsQiw0REFBNEQ7SUFDOUQsWUFBWSxFQUFFLG9EQUFvRDtJQUNsRSxZQUFZLEVBQUUseURBQXlEO0lBQ3ZFLG1CQUFtQixFQUFFLCtDQUErQztDQUNyRSxDQUFDO0FBSUYsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBRTNCLE1BQU0sVUFBVSxTQUFTLENBQUMsTUFBYTtJQUNyQyxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDMUQsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDdEIsTUFBTSxJQUFJLEdBQUcsOEJBQThCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXpELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN0QixvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0tBQ0Y7SUFDRCxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFDLEdBQVk7SUFHdkMsT0FBTyxPQUFPLENBQ1osR0FBRyxFQUNIO1FBQ0UsT0FBTyxFQUFFLEtBQUs7UUFDZCxhQUFhLEVBQUUsS0FBSztRQUNwQixLQUFLLEVBQUUsSUFBSTtRQUNYLGNBQWMsRUFBRSxRQUFRO1FBRXhCLFVBQVUsRUFBRSxLQUFLO1FBRWpCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE1BQU0sRUFBRSxJQUFJO1FBRVosT0FBTyxFQUFFLElBQUk7S0FDZCxDQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FDM0IsTUFBZSxFQUNmLFFBQWlCLEVBQ2pCLFFBQWdCO0lBRWhCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztJQUNwQixNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXpELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUluQixJQUNFLFFBQVEsS0FBSyxhQUFhO1FBQzFCLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUk7WUFDN0MsT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUM7WUFDbEQsQ0FBQyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsRUFDbkU7UUFDQSxRQUFRLEdBQUcsbUJBQW1CLENBQUM7S0FDaEM7SUFJRCxJQUNFLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUN0RCxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUNuQztRQUdBLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFJMUQsSUFBSSxXQUFXLElBQUksZUFBZSxFQUFFO1lBQ2xDLElBQ0UsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQztnQkFDL0MsQ0FBQyxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQztnQkFDbkQsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFDaEM7Z0JBQ0EsT0FBTyxHQUFHLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNO29CQUN6QyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNqRDtTQUNGO2FBQU0sSUFBSSxRQUFRLEtBQUssbUJBQW1CLEVBQUU7WUFJM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3hFLElBQUksV0FBVyxHQUFHLFNBQVMsRUFBRTtnQkFDM0IsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN0QyxDQUFDLEVBQUUsQ0FBQztpQkFDTDtnQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBR1QsU0FBUyxHQUFHLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUNwQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNQO2FBQ0Y7U0FDRjtLQUNGO0lBSUQsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2QsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDWCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7U0FDeEI7YUFBTTtZQUNMLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDWDtRQUNELFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNsQixhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxRCxNQUFNO1NBQ1A7UUFDRCxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzdDO0lBRUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR25FLElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtRQUVsQixNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR2hELElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDM0IsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLFlBQVksRUFBRSxDQUFDO1lBQzlDLE9BQU8sV0FBVyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7Z0JBQzlCLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNuQjtTQUNGO1FBRUQsT0FBTyxHQUFHLGlCQUFpQixDQUFDLFlBQVksT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDM0U7SUFJRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDVixHQUFHLEdBQUcsS0FBSyxJQUFJLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQzFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDaEI7SUFDRCxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7UUFDaEIsR0FBRyxHQUFHLE9BQU8sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQzNCLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDWjtJQUVELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbEIsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDO1FBQ3JDLEtBQUssS0FBSyxXQUFXLFlBQVksSUFBSSxHQUFHLGFBQWEsWUFBWSxFQUFFLENBQUM7SUFDdEUsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLE1BQU0sWUFBWSxnQkFBZ0IsQ0FBQztJQUU5RCxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUM7SUFDeEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxLQUFLLElBQUksWUFBWSxFQUFFLENBQUM7SUFDM0MsSUFBSSxTQUFTLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxFQUFFO1FBQ2pDLEtBQUssR0FBRyxhQUFhLENBQUM7UUFDdEIsU0FBUyxHQUFHLEdBQUcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3JDLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0tBQ2hDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0IsSUFBSSxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUdyQixJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtvQkFDakIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO3dCQUNqQixJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7NEJBQ25CLEdBQUcsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs0QkFDN0IsWUFBWSxFQUFFLENBQUM7eUJBQ2hCOzZCQUFNOzRCQUNMLEdBQUcsSUFBSSxLQUFLLElBQUksTUFBTSxZQUFZLEVBQUUsQ0FBQzs0QkFDckMsT0FBTyxHQUFHLElBQUksQ0FBQzt5QkFDaEI7cUJBQ0Y7b0JBQ0QsR0FBRyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUM3QixZQUFZLEVBQUUsQ0FBQztpQkFDaEI7Z0JBQ0QsR0FBRyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM3QixZQUFZLEVBQUUsQ0FBQzthQUNoQjtZQUVELFNBQVMsR0FBRyxDQUFDLENBQUM7WUFFZCxJQUFJLEtBQUssS0FBSyxXQUFXLEVBQUU7Z0JBQ3pCLEdBQUcsSUFBSSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNyQztpQkFBTTtnQkFDTCxLQUFLLElBQUksS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDdkM7WUFDRCxZQUFZLEVBQUUsQ0FBQztTQUdoQjthQUFNO1lBQ0wsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUloQyxJQUFJLGNBQWMsR0FBRyxVQUFVLEtBQUssWUFBWTtnQkFDOUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO29CQUN4QixVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBVTlDLElBQ0UsY0FBYztnQkFDZCxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFDMUIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQ3hDO2dCQUNBLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLFVBQVUsSUFBSSxHQUFHLENBQUM7YUFDbkI7WUFDRCxJQUFJLGNBQWMsRUFBRTtnQkFHbEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO29CQUNqQixJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7d0JBQ2pCLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTs0QkFDakIsSUFBSSxTQUFTLEtBQUssQ0FBQyxFQUFFO2dDQUNuQixHQUFHLElBQUksT0FBTyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0NBQ25DLFlBQVksRUFBRSxDQUFDOzZCQUNoQjtpQ0FBTTtnQ0FDTCxHQUFHLElBQUksS0FBSyxJQUFJLE1BQU0sWUFBWSxFQUFFLENBQUM7Z0NBQ3JDLE9BQU8sR0FBRyxJQUFJLENBQUM7NkJBQ2hCO3lCQUNGO3dCQUNELEdBQUcsSUFBSSxPQUFPLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQzt3QkFDbkMsWUFBWSxFQUFFLENBQUM7cUJBQ2hCO29CQUNELEdBQUcsSUFBSSxPQUFPLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDbkMsWUFBWSxFQUFFLENBQUM7aUJBQ2hCO2dCQUVELFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBR2QsR0FBRyxJQUFJLEtBQUssS0FBSyxJQUFJLFlBQVksSUFBSSxVQUFVLEVBQUUsQ0FBQztnQkFDbEQsS0FBSyxJQUFJLEtBQUssR0FBRyxJQUFJLFlBQVksSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDcEQsWUFBWSxJQUFJLENBQUMsQ0FBQzthQUVuQjtpQkFBTTtnQkFHTCxHQUFHLElBQUksS0FBSyxDQUFDO2dCQUNiLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ1gsU0FBUyxFQUFFLENBQUM7Z0JBR1osSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO29CQUNsQixHQUFHLElBQUksT0FBTyxVQUFVLEVBQUUsQ0FBQztvQkFDM0IsWUFBWSxFQUFFLENBQUM7aUJBQ2hCO2FBQ0Y7U0FDRjtRQUVELElBQUksWUFBWSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsRUFBRTtZQUN6QyxPQUFPLEdBQUcsR0FBRyxHQUFHLFVBQVUsS0FBSyxHQUFHLEtBQUssSUFBSSxNQUFNLFlBQVksR0FBRyxLQUFLLElBQUk7Z0JBQ3ZFLEdBQUcsSUFBSSxNQUFNLFlBQVksRUFBRSxDQUFDO1NBQy9CO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUM7QUFDaEYsQ0FBQztBQTJCRCxNQUFNLE9BQU8sY0FBZSxTQUFRLEtBQUs7SUFJdkMsWUFBWSxPQUF5QztRQUNuRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ25ELE1BQU0sSUFBSSxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsTUFBTSxFQUNKLE9BQU8sRUFDUCxRQUFRLEVBQ1IsWUFBWSxFQUNaLE9BQU8sRUFFUCxrQkFBa0IsR0FDbkIsR0FBRyxPQUFPLENBQUM7UUFDWixJQUFJLEVBQ0YsTUFBTSxFQUNOLFFBQVEsR0FDVCxHQUFHLE9BQU8sQ0FBQztRQUlaLE1BQU0sS0FBSyxHQUFJLEtBQWtDLENBQUMsZUFBZSxDQUFDO1FBQ2pFLEtBQWtDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUV4RCxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFHaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNoQixJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNWLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ1gsWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFDbEIsR0FBRyxHQUFHLEVBQUUsQ0FBQztpQkFDVjtxQkFBTTtvQkFDTCxJQUFJLEdBQUcsWUFBWSxDQUFDO29CQUNwQixLQUFLLEdBQUcsWUFBWSxDQUFDO29CQUNyQixZQUFZLEdBQUcsWUFBWSxDQUFDO29CQUM1QixHQUFHLEdBQUcsWUFBWSxDQUFDO2lCQUNwQjthQUNGO1lBSUQsSUFDRSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUk7Z0JBQzdDLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLEtBQUssSUFBSTtnQkFDakQsT0FBTyxJQUFJLE1BQU0sSUFBSSxNQUFNLFlBQVksS0FBSztnQkFDNUMsT0FBTyxJQUFJLFFBQVEsSUFBSSxRQUFRLFlBQVksS0FBSyxFQUNoRDtnQkFDQSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMzQixRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2hDO1lBRUQsSUFBSSxRQUFRLEtBQUssaUJBQWlCLElBQUksUUFBUSxLQUFLLGFBQWEsRUFBRTtnQkFDaEUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDbEQ7aUJBQU0sSUFDTCxRQUFRLEtBQUssb0JBQW9CO2dCQUNqQyxRQUFRLEtBQUssZ0JBQWdCLEVBQzdCO2dCQUdBLElBQUksSUFBSSxHQUFHLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUk3QyxJQUNFLFFBQVEsS0FBSyxnQkFBZ0I7b0JBQzdCLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQzt3QkFDOUMsT0FBTyxNQUFNLEtBQUssVUFBVSxDQUFDLEVBQy9CO29CQUNBLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQztpQkFDL0M7Z0JBR0QsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtvQkFDbkIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLFlBQVksRUFBRSxDQUFDO29CQUN0QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO3dCQUN0QixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7cUJBQ1g7aUJBQ0Y7Z0JBR0QsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDcEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUM5RDtxQkFBTTtvQkFDTCxLQUFLLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pDO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxRQUFRLEtBQUssY0FBYyxJQUFJLEdBQUcsS0FBSyxLQUFLLEVBQUU7b0JBQ2hELEdBQUcsR0FBRyxHQUFHLGFBQWEsT0FBTyxHQUFHLEVBQUUsQ0FBQztvQkFDbkMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRTt3QkFDckIsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztxQkFDbEM7b0JBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNaO3FCQUFNO29CQUNMLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7d0JBQ3BCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7cUJBQ2pDO29CQUNELElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7d0JBQ3RCLEtBQUssR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7cUJBQ3JDO29CQUNELElBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTt3QkFDNUIsR0FBRyxHQUFHLEdBQUcsYUFBYSxPQUFPLEdBQUcsbUNBQW1DLENBQUM7cUJBQ3JFO3lCQUFNO3dCQUNMLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLEdBQUcsUUFBUSxTQUFTLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxLQUFLLEVBQUU7NEJBQ1QsR0FBRyxHQUFHLEdBQUcsS0FBSyxPQUFPLEdBQUcsdUNBQXVDLENBQUM7eUJBQ2pFOzZCQUFNOzRCQUNMLEtBQUssR0FBRyxJQUFJLFFBQVEsSUFBSSxLQUFLLEVBQUUsQ0FBQzt5QkFDakM7cUJBQ0Y7b0JBQ0QsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ3pCO2FBQ0Y7U0FDRjtRQUVBLEtBQWtDLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU1RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDakMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNqQyxLQUFLLEVBQUUsZ0NBQWdDO1lBQ3ZDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7UUFFNUIsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUUxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUM1QyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDN0M7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDMUI7UUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxDQUFDO1FBRWxFLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFWCxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQy9CLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQXFCLEVBQUUsR0FBNEI7UUFFbEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM5QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRWxDLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDekMsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLE1BQU0sS0FBSyxHQUFJLElBQUksQ0FBQyxJQUFJLENBQVksQ0FBQztnQkFDckMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtvQkFDckIsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztpQkFDekM7cUJBQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2lCQUN2QzthQUNGO1NBQ0Y7UUFNRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQzNCLEdBQUcsR0FBRztZQUNOLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQyxDQUFDO1FBR0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFFNUIsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBRUQsZUFBZSxjQUFjLENBQUMifQ==