import { describe, it, expect } from 'vitest';
import { crc32, crc32U } from '../lib/crc.js';

describe('CRC32 ASCII', () => {
    it('Returns correct CRC32 for empty string', () => {
        expect(crc32('')).toBe(0);
    });

    it('Returns correct CRC32 for ASCII string', () => {
        // Precomputed CRC32 for 'hello world' is 222957957
        expect(crc32('hello world')).toBe(222957957);
    });

    it('Returns different CRC32 for different strings', () => {
        expect(crc32('foo')).not.toBe(crc32('bar'));
    });

    it('Returns correct CRC32 for long string', () => {
        const str = 'a'.repeat(1000);
        // Precomputed CRC32 is 2587417091
        expect(crc32(str)).toBe(2587417091);
    });
});

describe('CRC32 Unicode', () => {
    it('Returns correct CRC32 for empty string', () => {
        expect(crc32U('')).toBe(0);
    });

    it('Returns correct CRC32 for ASCII string', () => {
        // Precomputed CRC32 for 'hello world' is 222957957
        expect(crc32U('hello world')).toBe(222957957);
    });

    it('Returns correct CRC32 for Unicode string', () => {
        // Precomputed CRC32 for 'こんにちは' is 917239426
        expect(crc32U('こんにちは')).toBe(917239426);
    });

    it('Returns different CRC32 for different strings', () => {
        expect(crc32U('foo')).not.toBe(crc32('bar'));
    });

    it('Returns correct CRC32 for long string', () => {
        const str = '月火水木金土日'.repeat(1000);
        // Precomputed CRC32 is 1042663554
        expect(crc32U(str)).toBe(1042663554);
    });
});
