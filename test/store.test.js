import { describe, it, expect, vi } from 'vitest';
import { createStore, combineReducers, applyMiddleware, bindActionCreators, compose } from '../lib/store.js';

describe('createStore', () => {
  function counter(state = 0, action) {
    switch (action.type) {
      case 'INC':
        return state + 1;
      case 'DEC':
        return state - 1;
      default:
        return state;
    }
  }

  it('Should initialize with initial state', () => {
    const store = createStore(counter, 5);
    expect(store.getState()).toBe(5);
  });

  it('Should dispatch actions and update state', () => {
    const store = createStore(counter, 0);
    store.dispatch({ type: 'INC' });
    expect(store.getState()).toBe(1);
    store.dispatch({ type: 'DEC' });
    expect(store.getState()).toBe(0);
  });

  it('Should notify subscribers on dispatch', () => {
    const store = createStore(counter, 0);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'INC' });
    expect(listener).toHaveBeenCalled();
  });

  it('Should allow unsubscribing listeners', () => {
    const store = createStore(counter, 0);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.dispatch({ type: 'INC' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('Should replace reducer', () => {
    const store = createStore(counter, 0);
    const newReducer = () => 42;
    store.replaceReducer(newReducer);
    store.dispatch({ type: 'ANY' });
    expect(store.getState()).toBe(42);
  });
});

describe('combineReducers', () => {
  const a = (state = 1) => state;
  const b = (state = 2) => state;
  const rootReducer = combineReducers({ a, b });
  it('Should combine multiple reducers', () => {
    expect(rootReducer(undefined, { type: 'ANY' })).toEqual({ a: 1, b: 2 });
  });
});

describe('applyMiddleware', () => {
  it('Should apply middleware to dispatch', () => {
    const logger = vi.fn(() => next => action => {
      return next(action);
    });
    const reducer = (state = 0, action) => {
      switch (action.type) {
        case 'INC': return state + 1;
        default: return state;
      }
    };
    const enhancedCreateStore = applyMiddleware(logger)(createStore);
    const store = enhancedCreateStore(reducer, 0);
    store.dispatch({ type: 'INC' });
    expect(store.getState()).toBe(1);
    expect(logger).toHaveBeenCalled();
  });
});

describe('bindActionCreators', () => {
  it('Should bind a single action creator', () => {
    const inc = () => ({ type: 'INC' });
    const dispatch = vi.fn();
    const bound = bindActionCreators(inc, dispatch);
    bound();
    expect(dispatch).toHaveBeenCalledWith({ type: 'INC' });
  });

  it('Should bind multiple action creators', () => {
    const creators = {
      inc: () => ({ type: 'INC' }),
      dec: () => ({ type: 'DEC' })
    };
    const dispatch = vi.fn();
    const bound = bindActionCreators(creators, dispatch);
    bound.inc();
    bound.dec();
    expect(dispatch).toHaveBeenCalledWith({ type: 'INC' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'DEC' });
  });
});

describe('compose', () => {
  it('Should compose functions from right to left', () => {
    const add = x => x + 1;
    const double = x => x * 2;
    const composed = compose(add, double);
    expect(composed(3)).toBe(7); // add(double(3))
  });
});
