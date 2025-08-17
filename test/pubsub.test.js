import { describe, it, expect, vi } from 'vitest';
import PubSub from '../lib/pubsub.js';

describe('PubSub', () => {
    it('Should subscribe and publish events', () => {
        const pubsub = new PubSub();
        const callback = vi.fn();
        pubsub.subscribe('test', callback);
        pubsub.publish('test', 42, 'foo');
        expect(callback).toHaveBeenCalledWith(42, 'foo');
    });

    it('Should unsubscribe a callback', () => {
        const pubsub = new PubSub();
        const callback = vi.fn();
        const unsubscribe = pubsub.subscribe('topic', callback);
        unsubscribe();
        pubsub.publish('topic', 'data');
        expect(callback).not.toHaveBeenCalled();
    });

    it('Should unsubscribe all callbacks from a topic', () => {
        const pubsub = new PubSub();
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        pubsub.subscribe('topic', cb1);
        pubsub.subscribe('topic', cb2);
        pubsub.unsubscribeAll('topic');
        pubsub.publish('topic', 'data');
        expect(cb1).not.toHaveBeenCalled();
        expect(cb2).not.toHaveBeenCalled();
    });

    it('Should not fail when unsubscribing from a non-existent topic', () => {
        const pubsub = new PubSub();
        expect(() => pubsub.unsubscribe('nope', () => { })).not.toThrow();
    });

    it('Should remove topic when last subscriber is removed', () => {
        const pubsub = new PubSub();
        const cb = vi.fn();
        pubsub.subscribe('topic', cb);
        pubsub.unsubscribe('topic', cb);
        expect(pubsub.topics.has('topic')).toBe(false);
    });
});
