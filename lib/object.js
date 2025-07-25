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
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = sourceObj[key];
        if (isObject(val)) {
            Object.assign(flatObj, flat(val));
        } else {
            flatObj[key] = val;
        }
    }
    return flatObj;
}

/**
 * Merges two objects deeply, overwriting properties in the first object with those from the second.
 * If `clone` is true, it creates a deep copy of the two objects before merging and returns a new object.
 * @param {Object} obj1 - The first object to merge.
 * @param {Object} obj2 - The second object to merge.
 * @param {boolean} [clone=false] - If true, creates a deep copy of the two objects.
 * @returns {Object} - The merged object.
 */
export function deepMerge(obj1, obj2, clone = false) {
    if (clone) {
        obj1 = JSON.parse(JSON.stringify(obj1));
        obj2 = JSON.parse(JSON.stringify(obj2));
    }
    Object.keys(obj2).forEach((key) => {
        if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
            obj1[key] = deepMerge(obj1[key], obj2[key]);
        } else {
            obj1[key] = obj2[key];
        }
    });
    return obj1;
}
