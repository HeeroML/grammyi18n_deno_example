import { Type } from "../type.ts";
const _hasOwnProperty = Object.prototype.hasOwnProperty;
const _toString = Object.prototype.toString;
function resolveYamlOmap(data) {
    const objectKeys = [];
    let pairKey = "";
    let pairHasKey = false;
    for (const pair of data) {
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]")
            return false;
        for (pairKey in pair) {
            if (_hasOwnProperty.call(pair, pairKey)) {
                if (!pairHasKey)
                    pairHasKey = true;
                else
                    return false;
            }
        }
        if (!pairHasKey)
            return false;
        if (objectKeys.indexOf(pairKey) === -1)
            objectKeys.push(pairKey);
        else
            return false;
    }
    return true;
}
function constructYamlOmap(data) {
    return data !== null ? data : [];
}
export const omap = new Type("tag:yaml.org,2002:omap", {
    construct: constructYamlOmap,
    kind: "sequence",
    resolve: resolveYamlOmap,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib21hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUdsQyxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUN4RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUU1QyxTQUFTLGVBQWUsQ0FBQyxJQUFTO0lBQ2hDLE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUNoQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDakIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBRXZCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ3ZCLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLGlCQUFpQjtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTdELEtBQUssT0FBTyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsVUFBVTtvQkFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDOztvQkFDOUIsT0FBTyxLQUFLLENBQUM7YUFDbkI7U0FDRjtRQUVELElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFOUIsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O1lBQzVELE9BQU8sS0FBSyxDQUFDO0tBQ25CO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFTO0lBQ2xDLE9BQU8sSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtJQUNyRCxTQUFTLEVBQUUsaUJBQWlCO0lBQzVCLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxlQUFlO0NBQ3pCLENBQUMsQ0FBQyJ9