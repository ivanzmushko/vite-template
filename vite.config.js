import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import sassGlobImports from 'vite-plugin-sass-glob-import';
import { resolve } from 'path';
import { exec } from 'child_process';

async function postBuildCommands () {
    exec(`sh build.sh`)
}

const root = resolve(__dirname, '');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
    base: './',
    root,
    plugins: [
        injectHTML({}),
        sassGlobImports(),
        {
            name: 'postbuild-commands', // the name of your custom plugin. Could be anything.
            closeBundle: async () => {
                await postBuildCommands() // run during closeBundle hook. https://rollupjs.org/guide/en/#closebundle
            }
        },

    ],
    server: {
        open: true,
    },
    build: {
        minify: false,
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                404: resolve(root, '404.html'),
            },
            output: {
                entryFileNames: `js/[name].js`,
                chunkFileNames: `js/[name].js`,
                assetFileNames: `[ext]/[name].[ext]`
            }
        }
    }
});
