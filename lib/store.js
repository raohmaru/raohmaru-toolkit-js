// https://gist.github.com/gaearon/ffd88b0e4f00b22c3159

function mapValues(obj, fn) {
    return Object.keys(obj).reduce((result, key) => {
        result[key] = fn(obj[key], key);
        return result;
    }, {});
}

function pick(obj, fn) {
    return Object.keys(obj).reduce((result, key) => {
        if (fn(obj[key])) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

function bindActionCreator(actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args));
}

export function bindActionCreators(actionCreators, dispatch) {
    return typeof actionCreators === 'function' ?
        bindActionCreator(actionCreators, dispatch) :
        mapValues(actionCreators, actionCreator =>
            bindActionCreator(actionCreator, dispatch)
        );
}

export function compose(...funcs) {
    return arg => funcs.reduceRight((composed, f) => f(composed), arg);
}

export function applyMiddleware(...middlewares) {
    return (next) => (reducer, initialState) => {
        const store = next(reducer, initialState);
        let dispatch = store.dispatch;
        const chain = [];

        chain = middlewares.map(middleware => middleware({
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }));
        dispatch = compose(...chain)(store.dispatch);

        return { ...store, dispatch };
    };
}

export function combineReducers(reducers) {
    const finalReducers = pick(reducers, (val) => typeof val === 'function');
    return (state = {}, action) => mapValues(
        finalReducers,
        (reducer, key) => reducer(state[key], action)
    );
}

export function createStore(reducer, initialState) {
    let currentReducer = reducer;
    let currentState = initialState;
    const listeners = [];
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
    }

    return { dispatch, subscribe, getState, replaceReducer };
}
