/**
 * Class for managing event listeners. A signal can also represent reactive state management. It is a way to model state that automatically updates dependent code when the state changes.
 */
export class Signal {
	/**
	 * Creates a new signal with the optional initial value.
	 * @param {*} [value] - The initial value of the signal.
	 */
	constructor(value = null) {
		this._value = value;
		this._listeners = [];
	}

	/**
	 * Get the current value.
	 * @returns {*} The current value of the signal.
	 */
	get() {
		return this._value;
	}

	/**
	 * Set a new value and notify subscribers.
     * If a function is passed, it will be called with the current value and the return value will be set as the new value.
	 * @param {*|Function} newValue
	 */
	set(valueOrFn) {
        const newValue = (typeof valueOrFn === 'function') ? valueOrFn(this._value) : valueOrFn;
		if (this._value !== newValue) {
			this._value = newValue;
			this.emit(this._value);
		}
	}

	/**
	 * Add a callback to be called when the signal's value changes.
	 * @param {Function} callback
	 */
	then(callback) {
		this._listeners.push(callback);
	}

	/**
	 * Emit the given values (or the current value if there ane no arguments) to all listeners.
     * Does not changes the stored value.
	 * @param  {...any} args
	 */
	emit(...args) {
		if (args.length === 0) {
			args = [this._value];
		}
		let i = this._listeners.length;
		while (i-- > 0) {
			this._listeners[i](...args);
		}
	}

	/**
	 * Remove a callback from the list of listeners.
	 * @param {Function} callback
	 */
	remove(callback) {
		this._listeners = this._listeners.filter((func) => func !== callback);
	}

	/**
	 * Clear all listeners.
	 */
	clear() {
		this._listeners.length = 0;
	}
};

/**
 * Creates a reactive state that can be used in a functional style.
 * @param {*} [value] - The initial value of the signal.
 * @returns {Function[]} An array containing a getter function and a setter function.
 */
export function state(value) {
    const signal = new Signal(value);
    const get = signal.get.bind(signal);
    get.__signal = signal;
    return [get, signal.set.bind(signal)];
}

/**
 * Creates a reactive effect that runs a callback whenever the state changes.
 * @param {Function} callback - The function to run when the state changes.
 * @param {*} [states] - An array of states to watch for changes.
 * @return {Function} - Function to stop watching the states (it removes the callbacks).
 */
export function effect(callback, states = []) {
    states.forEach((state) => {
        state.__signal.then(callback);
    });
    return () => {
        states.forEach((state) => {
            state.__signal.remove(callback);
        });
    };
}
