import { readdirSync } from 'node:fs';
import { dirname, resolve, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

function testFile(file, pattern) {
    return pattern instanceof RegExp ? pattern.test(file) : file.includes(pattern);
}

function getFiles(path, pattern, exclude) {
    return readdirSync(path)
        .filter((file) => pattern ? testFile(file, pattern) : true)
        .filter((file) => exclude ? !testFile(file, exclude) : true);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, 'lib');

export default defineConfig({
    build: {
        lib: {
            entry: {
                rtk: resolve(__dirname, './main.js'),
                // Multiple entry points for each file under lib/
                ...getFiles(baseDir, /\.(j|t)s$/, 'main.js')
                    .reduce((acc, file) => {
                        acc[basename(file, extname(file))] = join(baseDir, file);
                        return acc;
                    }, {})
            },
            name: 'RTK.js',
            formats: ['es']
        },
        sourcemap: true
    }
});
