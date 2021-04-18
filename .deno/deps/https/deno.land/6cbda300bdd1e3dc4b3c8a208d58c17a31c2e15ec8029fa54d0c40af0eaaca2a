
import isObject from "https://github.com/piyush-bhatt/is-object/raw/main/mod.ts";


export default function tableize(obj:any) {
  var target = {};
  flatten(target, obj, '');
  return target;
};

/**
 * Recursively flatten object keys to use dot-notation.
 *
 * @param {Object} `target`
 * @param {Object} `obj`
 * @param {String} `parent`
 */

function flatten(target :any, obj :any , parent : any) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];

      key = parent + key;
      if (isObject(val)) {
        flatten(target, val, key + '.');
      } else {
        target[key] = val;
      }
    }
  }
}