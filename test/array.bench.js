import { bench } from 'vitest';
// import { fillRange, fillRange2, fillRange3, fillRange4 } from '../lib/array.js';

function getLimits(start = 0, end) {
    if (!end) {
        return [0, start];
    }
    return [start, end - start + 1];
}

function fillRange(start = 0, end) {
    const [a, z] = getLimits(start, end);
    return Array.from({ length: z }, (_, i) => a + i);
}

function fillRange2(start = 0, end) {
    const [a, z] = getLimits(start, end);
    return Array(z).fill().map((_, i) => i + a);
}

function fillRange3(start = 0, end) {
    const [a, z] = getLimits(start, end);
    const arr = Array(z);
    for (let i = 0; i < z; i++) {
        arr[i] = a + i;
    }
    return arr;
}

function fillRange4(start = 0, end) {
    let [a, z] = getLimits(start, end);
    const arr = Array(z);
    while (z--) {
        arr[z] = a + z;
    }
    return arr;
}

const length = 1000;
const benchCfg = {
    iterations: 1000,
    // time: 1000,
    // warmup: 100,
};

bench('fillRange with Array.from', () => {
    fillRange(length);
}, benchCfg);

bench('fillRange with Array().fill', () => {
    fillRange2(length);
}, benchCfg);

bench('fillRange with for loop', () => {
    fillRange3(length);
}, benchCfg);

bench('fillRange with while loop', () => {
    fillRange4(length);
}, benchCfg);