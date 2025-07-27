import { describe, it, expect, vi } from 'vitest';
import { memoize } from '../lib/func.js';

describe('memoize', () => {
  it('Should return the correct result for a simple function', () => {
    const add = (a, b) => a + b;
    const memoizedAdd = memoize(add);
    expect(memoizedAdd(1, 2)).toBe(3);
    expect(memoizedAdd(2, 3)).toBe(5);
  });

  it('Should cache results for the same arguments', () => {
    const callback = vi.fn((a, b) => a * b);
    const memoizedMultiply = memoize(callback);
    expect(memoizedMultiply(2, 3)).toBe(6);
    expect(memoizedMultiply(2, 3)).toBe(6);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('Should work with functions returning objects', () => {
    const makeObj = (x) => ({ x });
    const memoizedMakeObj = memoize(makeObj);
    const obj1 = memoizedMakeObj(1);
    const obj2 = memoizedMakeObj(1);
    expect(obj1).toBe(obj2); // Should be the same reference from cache
  });
});
