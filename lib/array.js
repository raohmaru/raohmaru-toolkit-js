/**
 * Fills an array with integers from `start` to `end`.
 * If `end` is not provided, the range goes from `0` to `start - 1`.
 * If `start` is greater than `end`, an empty array is returned.
 * @param {Number} start - The start of the range (or the end if `end` is not provided).
 * @param {Number} [end] - The end of the range (inclusive).
 * @returns {Number[]}
 */
export function fillRange(start = 0, end) {
    if (end === undefined) {
        end = start;
        start = 0;
    } else {
        end = end - start + 1;
    }
    if (start > end) {
        return [];
    }
    const arr = Array(end);
    // Most performant method. See array.bench.js.
    for (let i = 0; i < end; i++) {
        arr[i] = start + i;
    }
    return arr;
}
