import { describe, it, expect } from 'vitest';
import { fillRange } from '../lib/array.js';

describe('sample', () => {
    it('Creates an array filled with values from 0 to 9', () => {
        expect(fillRange(10)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('Creates an array filled with values from 0 to 10', () => {
        expect(fillRange(0, 10)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('Creates an array filled with values from 10 to 20', () => {
        expect(fillRange(10, 20)).toStrictEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

    it('Creates an empty array', () => {
        expect(fillRange(0)).toStrictEqual([]);
    });
});
