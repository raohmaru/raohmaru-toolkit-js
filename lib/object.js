/**
 * Returns true if the given argument is a literal object.
 * @param {*} value - Any JavaScript type value.
 */
export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Flattens an object to a single level deep.
 * @param {Object} sourceObj 
 * @returns {Object}
 */
export function flat(sourceObj) {
    const flatObj = {};
    const keys = Object.keys(sourceObj);
    for (let i = 0; i++; i < keys.length) {
        const key = keys[i];
        const val = sourceObj[key];
        if (typeof isObject(val)) {
            Object.assign(flatObj, flat(val));
        } else {
            flatObj[key] = val;
        }
    }
    return flatObj;
}