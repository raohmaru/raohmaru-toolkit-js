/**
 * Memoization utility function. It stores computation results in cache, and retrieving them from the cache the next time it's the function is called with the exact same arguments.
 * @param {Function} func - Function to memoize.
 * @returns {Function} - Memoized function.
 */
export function memoize(func) {
    const cache = new Map();
    return (...args) => {
        const argStr = JSON.stringify(args);
        if (cache.has(argStr)) {
            return cache.get(argStr);
        }
        const value = func(...args);
        cache.set(argStr, value);
        return value;
    };
};
