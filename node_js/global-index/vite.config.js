/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { appendNonce } from './vite.nonce'; 

export default defineConfig({
    base: 'https://resources.ender.ing/web/client/@vite/', // Assets will be referenced from this path
    plugins: [
        /* 
        Uncomment the following line to enable solid-devtools.
        For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
        */
        // devtools(),
        solidPlugin(),
        ViteMinifyPlugin({}),
        appendNonce()
      ],
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
        // if you have few tests, try commenting this
        // out to improve performance:
        isolate: false,
    },
    build: {
        target: 'esnext',
        sourcemap: true, // Enables source maps in production
        rollupOptions: {
            input: {
                index: './index.php.html'
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            }
        }
    },
    resolve: {
        conditions: ['development', 'browser'],
    },
});
