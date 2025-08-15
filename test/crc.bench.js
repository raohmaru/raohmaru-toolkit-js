import { bench } from 'vitest';
import { crc32, crc32U } from '../lib/crc.js';

const str = 'a'.repeat(10000);

function benchCRC32() {
    crc32(str);
}

function benchCRC32U() {
    crc32U(str);
}

const benchCfg = {
    iterations: 1000
    // time: 1000,
    // warmup: 100,
};

bench('CRC32 ASCII', () => {
    benchCRC32();
}, benchCfg);


bench('CRC32 Unicode', () => {
    benchCRC32U();
}, benchCfg);
