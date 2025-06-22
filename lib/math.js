const PI = Math.PI;

/**
 * Gets a position for the given time in a bezier curve with 3 control points.
 * @param {Number} t - Value between  0 to 1
 * @param {Number} x1 - Control point 1
 * @param {Number} x2 - Control point 2
 * @param {Number} x3 - Control point 3
 * @returns {Number}
 * @see https://javascript.info/bezier-curve
 */
export function bezier3(t, x1, x2, x3) {
    return ((1 - t) ** 2) * x1 + 2 * (1 - t) * t * x2 + t ** 2 * x3;
}

/**
 * Converts an angle from degrees to [radians](https://en.wikipedia.org/wiki/Radian).
 * @param {Number} degree - Angle in degrees
 * @return {Number}
 */
export function toRadians(degree) {
	return degree * PI / 180;
};
