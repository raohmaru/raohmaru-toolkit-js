/**
 * Mini template engine. Parses variables (w/o dot notation) and does not delete undefined variable expressions.
 * @param {string} expr - String expression with {{variables}} to interpolate.
 * @param {RegExp} [regex] - Custom regex to match variables. By default it matches double curly braces `{{variables}}`.
 * @returns {(data:Object|string[]) => string} - A function that accepts an object or an array as argument to interpolate the template variables.
 * @example
 * const templateObj = parseTemplate('{{a}} {{b.c}}');
 * template({a: 'hello', b: {c:'world'}}); // "hello world"
 *
 * const templateArr = parseTemplate('{{}} {{}}');
 * templateArr(["hello", "world"]); // "hello world"
 *
 * const templateArrIndex = parseTemplate('{{0}} {{1}}');
 * templateArrIndex(["hello", "world"]); // "hello world"
 *
 * parseTemplate('{{name}}')(); // "{{name}}"
 */
export const parseTemplate = (expr, regex = /\{\{([^}]*)}}/g) => {
    return (data) => {
        let i = 0;
        return expr.replace(regex, (s, p1) => {
            if (Array.isArray(data)) {
                return data[p1 || i++] || s;
            }
            // Get property of object using a string with dot notation
            return p1.split('.').reduce((o, i) => o[i] ?? s, data || {});
        })
    }
}
