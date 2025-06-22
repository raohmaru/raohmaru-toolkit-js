/**
 * Fast query selector.
 * @param {string} selector - Valid CSS selector
 * @param {Element} [root=document] - Element on which run the query
 * @returns {Element}
 */
export function $(selector, root) {
    const element = root || document;
    if (selector[0] === '#') {
        return element.getElementById(selector.substr(1));
    } 
    return element.querySelector(selector);
}

/**
 * Shortcut for document.querySelectorAll().
 * @param {string} selector - Valid CSS selector
 * @param {Element} [root=document] - Element on which run the query
 * @returns {NodeList}
 */
export function $$(selector, root) {
    const element = root || document;
    return element.querySelectorAll(selector);
}

/**
 *  Parses a string of HTML into a DocumentFragment or Element.
 * @param {*} htmlString - String containing HTML to parse
 * @returns {NodeList|Element} - Parsed HTML as a NodeList or Element
 */
export function parseDOMString(htmlString) {
    const docFrag = document.createRange().createContextualFragment(htmlString);
    // const template = document.createElement('template');
    // template.innerHTML = html;
    // const docFrag = template.content;
    if (docFrag.childNodes.length > 1) {
        return docFrag.childNodes;
    }
    return docFrag.firstChild;
}