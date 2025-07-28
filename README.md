# Raohmaru Toolkit for JavaScript (RTK.js)

[![GitHub Release](https://img.shields.io/github/v/release/raohmaru/rtkjs)
](https://github.com/raohmaru/rtkjs/releases)
[![CI](https://github.com/raohmaru/rtkjs/actions/workflows/ci.yml/badge.svg)](https://github.com/raohmaru/rtkjs/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/raohmaru/rtkjs/badge.svg)](https://coveralls.io/github/raohmaru/rtkjs)
[![GitHub License](https://img.shields.io/github/license/raohmaru/rtkjs)](https://github.com/raohmaru/rtkjs/blob/main/LICENSE)

A lightweight toolkit library for JavaScript applications with 0 dependencies.

## Installation
You can install the library using npm.

```bash
npm install @raohmaru/rtkjs
```

## Usage
You can import the entire library or specific modules as needed. It is recommended to import only the modules you need to take advantage of [tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) and keep your bundle size small.

### Importing specific modules
You can import functions and classes directly from their respective modules.

```javascript
import { fillRange } from '@raohmaru/rtkjs/array';
import { Beat } from '@raohmaru/rtkjs/beat';
import { $ } from '@raohmaru/rtkjs/dom';
```

### Importing from the main entry point
You can also import module namespaces from the main entry point.

```javascript
import { array, Beat, state } from '@raohmaru/rtkjs';
```

## API Reference

### Array
Utilities for working with arrays.

#### `fillRange(start, [end])`
Fills an array with integers from `start` to `end`.

```javascript
fillRange(5); // [0, 1, 2, 3, 4]
fillRange(2, 5); // [2, 3, 4, 5]
```

### Beat
A class for creating a frame-rate-independent game loop.

#### `new Beat(callback, [fps])`
The `Beat` class calls the `callback` function at a given frame rate (fps). It's useful for animations and game loops, providing a consistent speed across different devices.

```javascript
const myBeat = new Beat((time, delta) => {
  // 'time' is the total time since start
  // 'delta' is the time since the last frame
  console.log(`Time: ${time.toFixed(0)}ms, Delta: ${delta.toFixed(2)}ms`);
}, 30); // 30 fps

myBeat.start();
```

### DOM
Utilities for DOM manipulation.

#### `$(selector, [root])`
A fast query selector, equivalent to `root.querySelector(selector)`. It's optimized for ID selectors.

#### `$$(selector, [root])`
A shortcut for `root.querySelectorAll(selector)`.

#### `parseDOMString(htmlString)`
Parses an HTML string into a `DocumentFragment` or a single `Element`.

```javascript
const app = $('#app');
const buttons = $$('button', app);
const newElement = parseDOMString('<p>Hello World</p>');
app.appendChild(newElement);
```

### Func
Functional programming related utilities.

#### `memoize(func)`
Stores the results of a function in cache to save computation effort if the arguments are the same.
```javascript
const expensiveFunction = (...args) => { /* ... */ };
const memoizedFunction = memoize(expensiveFunction);
expensiveFunction(0);
expensiveFunction(0); // Returns cached result
```

### Math
Mathematical helper functions.

#### `bezier3(t, x1, x2, x3)`
Calculates a point on a quadratic Bézier curve.

#### `toRadians(degree)`
Converts an angle from degrees to radians.

```javascript
const position = bezier3(0.5, 0, 100, 200); // 75
const radians = toRadians(180); // 3.14159...
```

### Object
Utilities for working with objects.

#### `isObject(value)`
Returns `true` if the value is a [literal](https://developer.mozilla.org/en-US/docs/Glossary/Literal) object.

#### `flat(sourceObj)`
Flattens a nested object to a single level.

#### `deepMerge(obj1, obj2, [clone])`
Merges two objects deeply.

```javascript
const nested = { a: 1, b: { c: 2, d: { e: 3 } } };
flat(nested); // { a: 1, c: 2, e: 3 }

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 4 }, e: 5 };
deepMerge(obj1, obj2);
console.log(obj1); // { a: 1, b: { c: 2, d: 4 }, e: 5 }
```

### Random
Functions for generating random values.

#### `sample(arr, [qty])`
Gets one or more random items from an array.

#### `random(min, [max])`
Generates a random float between `min` (inclusive) and `max` (exclusive).

#### `randomInt(min, [max])`
Generates a random integer between `min` (inclusive) and `max` (exclusive).

```javascript
const arr = [1, 2, 3, 4, 5];
sample(arr); // a single random item
sample(arr, 3); // an array with 3 random items
random(5, 10); // float between 5 and 10
randomInt(5, 10); // integer between 5 and 9
```

### Signal
A simple reactive state management implementation.

#### `new Signal([initialValue])`
Class for managing event listeners that can also represent reactive state management.

```javascript
const signal = new Signal(0);
signal.then((value) => console.log(value));
signal.set(1);
signal.emit(2);
```

#### `state(initialValue)`
Creates a reactive state, returning a getter and a setter function.

#### `effect(callback, states)`
Creates a reactive effect that runs a callback whenever a watched state changes.

```javascript
const [count, setCount] = state(0);
effect(() => {
  console.log(`The count is: ${count()}`);
}, [count]);
// The count is: 0
setCount(c => c + 1);
// The count is: 1
```

### Store
A Redux-like state management container.

#### `createStore(reducer, [initialState])`
Creates a store that holds the complete state tree of your app.

```javascript
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
}

const store = createStore(counter);
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'INCREMENT' }); // 1
```

### String
Utilities for working with strings.

#### `parseTemplate(expression, [regex])`
A mini template engine that interpolates variables in a string. It supports dot notation for object properties.

```javascript
const template = parseTemplate('Hello, {{user.name}}!');
const result = template({ user: { name: 'Alex' } });
console.log(result); // "Hello, Alex!"
```

### Timing
Functions for controlling the timing of function execution.

#### `throttle(func, wait)`
Limits the execution of a function to once every `wait` milliseconds.

#### `debounce(func, delay)`
Delays the execution of a function until after `delay` milliseconds have passed since the last time it was invoked.

```javascript
const debouncedFn = debounce(() => console.log('Saving...'), 500);
document.querySelector('input').addEventListener('keyup', debouncedFn);
```

#### `wait(ms)`
An async function that resolves after a specified number of milliseconds.

```javascript
async function doSomething() {
  console.log('Waiting...');
  await wait(2000);
  console.log('2 seconds have passed.');
}
doSomething();
```

---

# License
Distributed under the [MIT license](https://github.com/raohmaru/rtkjs/blob/main/LICENSE).
