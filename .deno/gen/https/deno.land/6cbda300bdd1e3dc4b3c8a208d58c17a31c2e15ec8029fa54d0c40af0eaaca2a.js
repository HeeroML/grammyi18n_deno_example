import isObject from "https://github.com/piyush-bhatt/is-object/raw/main/mod.ts";
export default function tableize(obj) {
    var target = {};
    flatten(target, obj, '');
    return target;
}
;
function flatten(target, obj, parent) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            key = parent + key;
            if (isObject(val)) {
                flatten(target, val, key + '.');
            }
            else {
                target[key] = val;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiZWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWJlbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFFBQVEsTUFBTSwyREFBMkQsQ0FBQztBQUdqRixNQUFNLENBQUMsT0FBTyxVQUFVLFFBQVEsQ0FBQyxHQUFPO0lBQ3RDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQUEsQ0FBQztBQVVGLFNBQVMsT0FBTyxDQUFDLE1BQVcsRUFBRSxHQUFRLEVBQUcsTUFBWTtJQUNuRCxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtRQUNuQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5CLEdBQUcsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ25CLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQixPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDakM7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUNuQjtTQUNGO0tBQ0Y7QUFDSCxDQUFDIn0=