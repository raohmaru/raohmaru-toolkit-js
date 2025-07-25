const NOW = Date.now;

/**
 * Throttles a function call to ensure it is not called more than once every specified time period.
 * @param {Function} func - The function to throttle.
 * @param {DOMHighResTimeStamp} wait - The time period in milliseconds during which the function should not be called again.
 * @returns
 */
export function throttle(func, wait) {
	let lastCallTime = 0,
		newFunc = (...args) => {
			let time = NOW();
			if (time > lastCallTime + wait) {
				func(...args);
				lastCallTime = time;
			}
		};
	return newFunc;
}

/**
 * Debounces a function call, ensuring it is only called after a specified delay since the last call.
 * @param {Function} func - The function to debounce.
 * @param {DOMHighResTimeStamp} delay - The delay in milliseconds after which the function should be called if no new calls are made.
 * @returns
 */
export function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Waits for a specified amount of time before resolving the promise.
 * @param {DOMHighResTimeStamp} ms - The time in milliseconds to wait before resolving the promise.
 * @returns {Promise} A promise that resolves after the specified time.
 */
export async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
