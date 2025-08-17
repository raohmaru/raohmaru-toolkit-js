/**
 * A basic Publish/Subscribe implementation.
 */
export default class PubSub {
    constructor() {
        this.topics = new Map();
    }

    /**
     * Subscribe to a topic.
     * @param {string} topic - The topic to subscribe to
     * @param {Function} callback - The callback function to execute when the topic is published.
     * @returns {Function} - Unsubscribe function.
     */
    subscribe(topic, callback) {
        if (!this.topics.has(topic)) {
            this.topics.set(topic, new Set());
        }
        this.topics.get(topic).add(callback);
        return () => this.unsubscribe(topic, callback);
    }

    /**
     * Publish data to a topic.
     * @param {string} topic - The topic to publish to.
     * @param {*} data - The data to publish.
     */
    publish(topic, ...args) {
        this.topics.get(topic)?.forEach(cb => cb(...args));
    }

    /**
     * Unsubscribe a callback from a topic.
     * @param {string} topic - The topic to unsubscribe from.
     * @param {Function} callback - The callback function to remove.
     */
    unsubscribe(topic, callback) {
        if (!this.topics.has(topic)) {
            return;
        }
        const subscribers = this.topics.get(topic);
        subscribers.delete(callback);
        if (!subscribers.size) {
            this.topics.delete(topic);
        }
    }

    /**
     * Unsubscribe all callbacks from a topic.
     * @param {string} topic - The topic to unsubscribe all callbacks from.
     */
    unsubscribeAll(topic) {
        this.topics.delete(topic);
    }
}
