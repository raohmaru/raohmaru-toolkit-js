/**
 * Fills an array with integers from `start` to `end`.
 * If `end` is not defined, the range goes from `0` to `start - 1`.
 * If both arguments are defined, the final array includes the full range (inclusive of `start` and `end`).
 * @param {Number} start - Integer
 * @param {Number} end - Integer
 * @returns {Array[Number]}
 */
export function fillRange(start = 0, end) {
    if (!end) {
        end = start;
        start = 0;
    } else {
        end = end - start + 1;
    }
    // return Array(end).fill().map((x, i) => i + start);
    return Array.from({ length: end }, (_, i) => start + i + 1);
}