import { describe, it, expect } from 'vitest';
import { sample, random, randomInt } from '../lib/random.js';

describe('sample', () => {
    it('Returns a single random element from an array', () => {
        const arr = [1, 2, 3, 4];
        const result = sample(arr);
        expect(arr).toContain(result);
    });

    it('Returns multiple unique random elements when qty > 1', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = sample(arr, 3);
        expect(result.length).toBe(3);
        result.forEach(val => expect(arr).toContain(val));
        // Should be unique
        expect(new Set(result).size).toBe(result.length);
    });

    it('Returns all elements if qty >= arr.length', () => {
        const arr = [1, 2, 3];
        const result = sample(arr, 5);
        expect(result.sort()).toEqual(arr.sort());
    });
});

describe('random', () => {
    it('Returns a float between min (inclusive) and max (exclusive)', () => {
        for (let i = 0; i < 10; i++) {
            const val = random(5, 10);
            expect(val).toBeGreaterThanOrEqual(5);
            expect(val).toBeLessThan(10);
        }
    });

    it('Returns a float between 0 and min if only min is provided', () => {
        for (let i = 0; i < 10; i++) {
            const val = random(5);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(5);
        }
    });

    it('Returns a float between 0 and 1 if no arguments are provided', () => {
        for (let i = 0; i < 10; i++) {
            const val = random();
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(1);
        }
    });
});

describe('randomInt', () => {
    it('Returns an integer between min (inclusive) and max (exclusive)', () => {
        for (let i = 0; i < 20; i++) {
            const val = randomInt(1, 3);
            expect(Number.isInteger(val)).toBe(true);
            expect(val).toBeGreaterThanOrEqual(1);
            expect(val).toBeLessThan(3);
        }
    });

    it('Returns an integer between 0 and min (exclusive) if only min is provided', () => {
        for (let i = 0; i < 20; i++) {
            const val = randomInt(2);
            expect(Number.isInteger(val)).toBe(true);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(2);
        }
    });
});
