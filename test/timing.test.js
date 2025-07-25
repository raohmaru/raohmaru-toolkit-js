import { describe, it, expect, vi } from 'vitest';
import { throttle, debounce, wait } from '../lib/timing.js';

describe('throttle', () => {
    it('Should call the function immediately and then throttle subsequent calls', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 250);
        throttled(); // should call
        throttled(); // should not call
        setTimeout(() => {
            throttled(); // should call
            expect(fn).toHaveBeenCalledTimes(2);
        }, 250);
    });

    it('Should pass arguments to the throttled function', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 250);
        throttled(1, 2);
        throttled('troncho');
        expect(fn).toHaveBeenCalledWith(1, 2);
        expect(fn).not.toHaveBeenCalledWith('troncho');
    });
});

describe('debounce', () => {
    it('Should only call the function after the delay', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 1000);
        debounced();
        debounced();
        debounced();
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('Should pass arguments to the debounced function', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 500);
        debounced('Galador', 42);
        vi.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledWith('Galador', 42);
        vi.useRealTimers();
    });
});

describe('wait', () => {
    it('Should pause execution the specified time', async () => {
        const then = performance.now();
        await wait(250);
        const now = performance.now();
        expect(now - then).toBeGreaterThanOrEqual(250);
    });

    it('Should resolve after the specified time', async () => {
        const promise = wait(250)
            .then(() => {
                return 1;
            });
        await expect(promise).resolves.toBe(1);
    });
});
