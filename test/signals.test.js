import { describe, it, expect, vi } from 'vitest';
import { Signal, state, effect } from '../lib/signals.js';

describe('Signal', () => {
    it('The value can be changed and retrieved', () => {
        const signal = new Signal(0);
        signal.set(1);
        expect(signal.get()).toBe(1);
        signal.set((prev) => prev + 1);
        expect(signal.get()).toBe(2);
    });

    it('Notifies listeners on value change', () => {
        const signal = new Signal(0);
        const callback = vi.fn();
        signal.then(callback);
        signal.set(1);
        expect(callback).toHaveBeenCalledWith(1);
        signal.set(2);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('Does not notify listeners if value does not change', () => {
        const signal = new Signal(0);
        const callback = vi.fn();
        signal.then(callback);
        signal.set(0);
        expect(callback).not.toHaveBeenCalled();
    });

    it('Removes listeners', () => {
        const signal = new Signal();
        const callback = vi.fn();
        signal.then(callback);
        signal.remove(callback);
        signal.set('test');
        expect(callback).not.toHaveBeenCalled();
    });

    it('Clears all listeners', () => {
        const signal = new Signal();
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        signal.then(cb1);
        signal.then(cb2);
        signal.clear();
        signal.set('test');
        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).not.toHaveBeenCalled();
    });

    it('Emit calls listeners with current value if no arguments are given', () => {
        const signal = new Signal('foo');
        const callback = vi.fn();
        signal.then(callback);
        signal.emit();
        expect(callback).toHaveBeenCalledWith('foo');
    });

    it('Emit calls listeners with provided arguments', () => {
        const signal = new Signal();
        const callback = vi.fn();
        signal.then(callback);
        signal.emit('Bar', 123);
        expect(callback).toHaveBeenCalledWith('Bar', 123);
    });
});

describe('state', () => {
    it('State can be changed and retrieved', () => {
        const [getState, setState] = state(0);
        setState(1);
        expect(getState()).toBe(1);
        setState((prev) => prev + 1);
        expect(getState()).toBe(2);
    });
});

describe('effect', () => {
    it('Runs callback when the stage changes', () => {
        const [getState, setState] = state(0);
        const callback = vi.fn();
        effect(callback, [getState]);
        setState(1);
        expect(callback).toHaveBeenCalledWith(1);
        setState(2);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('Clears all callbacks', () => {
        const [getState, setState] = state(0);
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        effect(cb1, [getState]);
        effect(cb2, [getState]);
        getState.__signal.clear();
        setState('test');
        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).not.toHaveBeenCalled();
    });

    it('Clean up all effects', () => {
        const [getState1, setState1] = state(0);
        const [getState2, setState2] = state();
        const callback = vi.fn();
        const cleanup = effect(callback, [getState1, getState2]);
        cleanup();
        setState1(1);
        setState2('troncho');
        expect(callback).not.toHaveBeenCalled();
    });
});
