import { describe, it, expect } from 'vitest';
import { isObject, flat, deepMerge } from '../lib/object.js';

describe('isObject', () => {
    it('Returns true for plain objects', () => {
        expect(isObject({})).toBe(true);
        expect(isObject({ a: 1 })).toBe(true);
    });

    it('Returns false for arrays', () => {
        expect(isObject([])).toBe(false);
    });

    it('Returns false for null', () => {
        expect(isObject(null)).toBe(false);
    });

    it('Returns false for primitives', () => {
        expect(isObject(42)).toBe(false);
        expect(isObject('string')).toBe(false);
        expect(isObject(true)).toBe(false);
        expect(isObject(undefined)).toBe(false);
    });

    it('Returns false for functions', () => {
        expect(isObject(() => { })).toBe(false);
    });

    it('Returns true when creating new instance of Object', () => {
        expect(isObject(new Object())).toBe(true);
    });

    it('Returns true when creating new Object with Object.create()', () => {
        expect(isObject(Object.create({}))).toBe(true);
        // Creating an object with properties
        expect(isObject(Object.create({}, { p: { value: 42 } }))).toBe(true);
        // Null as prototype
        expect(isObject(Object.create(null))).toBe(true);
    });
});

describe('flat', () => {
    it('Flattens a simple nested object', () => {
        const obj = { a: 1, b: { c: 2 } };
        const result = flat(obj);
        expect(result).toEqual({ a: 1, c: 2 });
    });

    it('Flattens deeply nested objects', () => {
        const obj = { a: 1, b: { c: 2, d: { e: 3 } }, f: 4 };
        const result = flat(obj);
        expect(result).toEqual({ a: 1, c: 2, e: 3, f: 4 });
    });

    it('Preserves non-object values', () => {
        const obj = { a: 1, e: { b: 'str', c: null } };
        const result = flat(obj);
        expect(result).toEqual({ a: 1, b: 'str', c: null });
    });

    it('Handles empty objects', () => {
        expect(flat({})).toEqual({});
        expect(flat(new Object())).toEqual({});
        expect(flat(Object.create({}))).toEqual({});
    });
});

describe('deepMerge', () => {
    it('Merges flat objects', () => {
        const a = { x: 1, y: 2 };
        const b = { y: 3, z: 4 };
        expect(deepMerge(a, b)).toEqual({ x: 1, y: 3, z: 4 });
    });

    it('Merges nested objects', () => {
        const a = { x: 1, y: { a: 2, b: 3 } };
        const b = { y: { b: 4, c: 5 }, z: 6 };
        expect(deepMerge(a, b)).toEqual({ x: 1, y: { a: 2, b: 4, c: 5 }, z: 6 });
    });

    it('Returns a deep clone if clone=true', () => {
        const a = { x: 1, y: { a: 2 } };
        const b = { y: { b: 3 } };
        const merged = deepMerge(a, b, true);
        expect(merged).toEqual({ x: 1, y: { a: 2, b: 3 } });
        merged.y.a = 99;
        expect(a.y.a).toBe(2);
    });

    it('Handles empty objects', () => {
        expect(deepMerge({}, {})).toEqual({});
        expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 });
        expect(deepMerge({}, { b: 2 })).toEqual({ b: 2 });
    });
});
