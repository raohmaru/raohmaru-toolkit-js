import { describe, it, expect } from 'vitest';
import { bezier3, toRadians } from '../lib/math.js';

describe('bezier3', () => {
    it('Returns control point 1 (x1) when t=0', () => {
        expect(bezier3(0, 1, 2, 3)).toBe(1);
    });

    it('Returns control point 2 (x2) when t=0.5', () => {
        expect(bezier3(0.5, 1, 2, 3)).toBeCloseTo(2);
    });

    it('Returns control point 3 (x3) when t=1', () => {
        expect(bezier3(1, 1, 2, 3)).toBe(3);
    });

    it('Returns control point value when all points are equal', () => {
        expect(bezier3(0.3, 5, 5, 5)).toBe(5);
    });
});

describe('toRadians', () => {
    it('Converts 0 degrees to 0 radians', () => {
        expect(toRadians(0)).toBe(0);
    });

    it('Converts 90 degrees to PI/2 radians', () => {
        expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
    });

    it('Converts 180 degrees to PI radians', () => {
        expect(toRadians(180)).toBeCloseTo(Math.PI);
    });

    it('Converts 360 degrees to 2*PI radians', () => {
        expect(toRadians(360)).toBeCloseTo(2 * Math.PI);
    });

    it('Converts negative degrees', () => {
        expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2);
    });

    it('Converts floating point degrees', () => {
        expect(toRadians(45.5)).toBeCloseTo(45.5 * Math.PI / 180);
    });
});
