import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        reporters: ['verbose'],
        coverage: {
            include: ['lib/*.js']
        }
    }
});
