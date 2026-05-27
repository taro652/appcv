import { defineConfig } from 'vite';

export default defineConfig({
    base: '/appcv/',
    optimizeDeps: {
        include: ['pdfjs-dist']
    },
    build: {
        commonjsOptions: {
        include: [/pdfjs-dist/, /node_modules/]
        }
    }
});