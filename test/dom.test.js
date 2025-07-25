// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { $, $$, parseDOMString } from '../lib/dom.js';

describe('$', () => {
    let root;
    const addElements = () => {
        root = document.createElement('div');
        root.innerHTML = `
            <div id="troncho"></div>
            <span class="percal"></span>
        `;
        document.body.appendChild(root);
    }

    beforeEach(() => {
        addElements();
    });

    it('Selects element by ID', () => {
        const el = $('#troncho', root);
        expect(el).not.toBeNull();
        expect(el.id).toBe('troncho');
    });

    it('Selects element by class', () => {
        const el = $('.percal', root);
        expect(el).not.toBeNull();
        expect(el.className).toBe('percal');
    });

    it('Defaults to document if no root argument is passed', () => {
        document.body.innerHTML = `<div id="Elrond"></div>`;
        expect($('#Elrond')).not.toBeNull();
    });

    it('Should return one element', () => {
        addElements();
        const el = $('.percal');
        expect(el).toBeInstanceOf(Element);
    });
});

describe('$$', () => {
    let root;
    beforeEach(() => {
        root = document.createElement('div');
        root.innerHTML = `
            <span class="troncho"></span>
            <span class="troncho"></span>
        `;
    });

    it('Selects all matching elements', () => {
        const els = $$('.troncho', root);
        expect(els.length).toBe(2);
        expect(els[0].className).toBe('troncho');
        expect(els[1].className).toBe('troncho');
    });

    it('Returns empty NodeList if no match', () => {
        const els = $$('.nope', root);
        expect(els).toBeInstanceOf(NodeList);
        expect(els.length).toBe(0);
    });
});

describe('parseDOMString', () => {
    it('Parses single element string', () => {
        const el = parseDOMString('<div id="percal"></div>');
        expect(el).not.toBeNull();
        expect(el).toBeInstanceOf(Element);
        expect(el.tagName).toBe('DIV');
        expect(el.id).toBe('percal');
    });

    it('Parses multiple elements string', () => {
        const nodes = parseDOMString('<span></span><div></div>');
        expect(nodes.length).toBe(2);
        expect(nodes[0].tagName).toBe('SPAN');
        expect(nodes[1].tagName).toBe('DIV');
    });

    it('Returns NodeList for multiple nodes', () => {
        const nodes = parseDOMString('<a></a><b></b>');
        expect(nodes).toBeInstanceOf(NodeList);
    });
});

