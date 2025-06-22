const MIN = Math.min;
const FLOOR = Math.floor;
const RND = Math.random;

/**
 * Produces a random sample from the given array.
 * @param {*[]} arr
 * @returns {*|*[]}
 */
export function sample(arr, qty = 1) {
	const newArr = [];
	const cloneArr = [...arr];
	for(let i = 0, len = MIN(qty, arr.length); i < len; i++) {
		newArr.push(...cloneArr.splice(FLOOR(RND() * cloneArr.length), 1));
	}
    return qty === 1 ? newArr[0] : newArr;
}

/**
 * Generates a random float number between two values (inclusive of `min`, but not `max`).
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} - Float number
 */
export function random(min, max) {
	if(!max) {
		if(!min) {
			return RND();
		}
		max = min;
		min = 0;
	}
	return RND() * (max - min) + min;
}

/**
 * Generates a random integer number between two values, both inclusive.
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} - Integer number
 */
export function randomInt(min, max) {
	return FLOOR( random(min, max + 1) );
}