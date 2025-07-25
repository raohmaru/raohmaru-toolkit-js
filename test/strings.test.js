import { describe, it, expect } from 'vitest';
import { parseTemplate } from '../lib/strings.js';

describe('parseTemplate', () => {
    it('Interpolates object properties', () => {
        const template = parseTemplate('{{a}} {{b.c}}');
        expect(template({ a: 'hello', b: { c: 'world' } })).toBe('hello world');
    });

    it('Interpolates array values with empty braces', () => {
        const templateArr = parseTemplate('{{}} {{}}');
        expect(templateArr(['hello', 'world'])).toBe('hello world');
    });

    it('Interpolates array values by index', () => {
        const templateArrIndex = parseTemplate('{{0}} {{1}}');
        expect(templateArrIndex(['hello', 'world'])).toBe('hello world');
    });

    it('Returns original template if variable is missing', () => {
        const template = parseTemplate('{{name}}');
        expect(template()).toBe('{{name}}');
        expect(template({})).toBe('{{name}}');
    });

    it('Does not delete undefined variable expressions', () => {
        const template = parseTemplate('{{foo}} {{bar}}');
        expect(template({ foo: 'hi' })).toBe('hi {{bar}}');
    });

    it('Supports custom regex', () => {
        const template = parseTemplate('<<a>> <<b>>', /<<([^>]*)>>/g);
        expect(template({ a: 'foo', b: 'bar' })).toBe('foo bar');
    });

    it('Handles nested dot notation', () => {
        const template = parseTemplate('{{user.name.first}} {{user.name.last}}');
        expect(template({ user: { name: { first: 'Eärendil', last: 'the Mariner' } } })).toBe('Eärendil the Mariner');
    });

    it('Handles array with missing index', () => {
        const templateArrIndex = parseTemplate('{{0}} {{1}} {{2}}');
        expect(templateArrIndex(['a', 'b'])).toBe('a b {{2}}');
    });
});
