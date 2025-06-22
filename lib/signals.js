/**
 * Class for managing event listeners. A signal can also represent reactive state management. It is a way to model state that automatically updates dependent code when the state changes.
 */
export default class Signal {
	/**
	 * Creates a new signal with the optional initial value.
	 * @param {*} [value] - The initial value of the signal.
	 * @returns {Function[]} An array containing two functions: the getter and setter for the signal value.
	 */
	constructor(value) {
		this._value = value;
		this._listeners = [];
		return [this.get, this.set];
	}

	/**
	 *  Get the current value.
	 * @returns {*} The current value of the signal.
	 */
	get() {
		return this._value;
	}

	/**
	 * Set a new value and notify subscribers.
	 * @param {*} newValue 
	 */
	set(newValue) {
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