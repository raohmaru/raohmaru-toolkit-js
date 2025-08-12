// https://gist.github.com/gaearon/ffd88b0e4f00b22c3159

/**
 * Applies a function to each value of an object and returns a new object with the same keys.
 * @param {Object} obj - The object whose values will be mapped.
 * @param {Function} fn - Function to apply to each value. Receives (value, key).
 * @returns {Object} A new object with the same keys and mapped values.
 * @example
 * mapValues({ a: 1, b: 2 }, v => v * 2); // { a: 2, b: 4 }
 */
function mapValues(obj, fn) {
    return Object.keys(obj).reduce((result, key) => {
        result[key] = fn(obj[key], key);
        return result;
    }, {});
}

/**
 * Picks properties from an object for which the predicate returns true.
 * @param {Object} obj - The object to pick properties from.
 * @param {Function} fn - Predicate function. Receives (value).
 * @returns {Object} A new object with only the picked properties.
 * @example
 * pick({ a: 1, b: 2 }, v => v === 2); // { b: 2 }
 */
function pick(obj, fn) {
    return Object.keys(obj).reduce((result, key) => {
        if (fn(obj[key])) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

/**
 * Binds an action creator to the dispatch function.
 * @param {Function} actionCreator - The action creator function.
 * @param {Function} dispatch - The store's dispatch function.
 * @returns {Function} A function that dispatches the action.
 * @example
 * const inc = () => ({ type: 'INC' });
 * const bound = bindActionCreator(inc, store.dispatch);
 * bound(); // dispatches { type: 'INC' }, same as store.dispatch({ type: 'INC' })
 */
function bindActionCreator(actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args));
}

/**
 * Binds one or more action creators to the dispatch function.
 * @param {Function|Object} actionCreators - A function or an object of functions.
 * @param {Function} dispatch - The store's dispatch function.
 * @returns {Function|Object} The bound action creator(s).
 * @example
 * const actions = { inc: () => ({ type: 'INC' }) };
 * const bound = bindActionCreators(actions, store.dispatch);
 * bound.inc(); // dispatches { type: 'INC' }
 */
export function bindActionCreators(actionCreators, dispatch) {
    return typeof actionCreators === 'function' ?
        bindActionCreator(actionCreators, dispatch) :
        mapValues(actionCreators, (actionCreator) =>
            bindActionCreator(actionCreator, dispatch)
        );
}

/**
 * Composes functions from right to left.
 * @param {...Function} funcs - Functions to compose.
 * @returns {Function} A function obtained by composing the argument functions from right to left.
 * @example
 * const add = x => x + 1;
 * const double = x => x * 2;
 * const composed = compose(add, double);
 * composed(3); // 7
 */
export function compose(...funcs) {
    return arg => funcs.reduceRight((composed, f) => f(composed), arg);
}

/**
 * Applies middleware to the store.
 * @param {...Function} middlewares - Middleware functions.
 * @returns {Function} A store enhancer applying the middleware.
 * @example
 * const logger = ({ getState }) => next => action => { console.log(action); return next(action); };
 * const enhancedCreateStore = applyMiddleware(logger)(createStore);
 * const store = enhancedCreateStore(reducer, initialState);
 */
export function applyMiddleware(...middlewares) {
    return (next) => (reducer, initialState) => {
        const store = next(reducer, initialState);
        let dispatch = store.dispatch;
        let chain = [];

        chain = middlewares.map(middleware => middleware({
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }));
        dispatch = compose(...chain)(store.dispatch);

        return { ...store, dispatch };
    };
}

/**
 * Combines multiple reducers into a single reducing function.
 * @param {Object} reducers - An object whose values are different reducing functions.
 * @returns {Function} A reducer that invokes every reducer inside the passed object.
 * @example
 * const rootReducer = combineReducers({ count: countReducer, user: userReducer });
 * const store = createStore(rootReducer, {});
 */
export function combineReducers(reducers) {
    const finalReducers = pick(reducers, (val) => typeof val === 'function');
    return (state = {}, action) => mapValues(
        finalReducers,
        (reducer, key) => reducer(state[key], action)
    );
}

/**
 * Creates a Redux-like store that holds the state tree.
 * @param {Function} reducer - A function that returns the next state tree, given the current state and an action to handle.
 * @param {*} initialState - The initial state.
 * @returns {Object} The store object with { dispatch, subscribe, getState, replaceReducer }.
 * @example
 * function counter(state = 0, action) {
 *   switch (action.type) {
 *     case 'INC': return state + 1;
 *     default: return state;
 *   }
 * }
 * const store = createStore(counter, 0);
 * store.dispatch({ type: 'INC' });
 * store.getState(); // 1
 */
export function createStore(reducer, initialState) {
    const listeners = [];
    let currentReducer = reducer;
    let currentState = initialState;
    let isDispatching = false;

    function getState() {
        return currentState;
    }

    function subscribe(listener) {
        listeners.push(listener);

        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function dispatch(action) {
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.');
        }

        try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        listeners.slice().forEach(listener => listener());
        return action;
    }

    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        dispatch({ type: '@@store/INIT' });
    }

    dispatch({ type: '@@store/INIT' });

    return { dispatch, subscribe, getState, replaceReducer };
}
