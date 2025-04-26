import copy from 'rollup-plugin-copy';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'thyuu-embed',
      fileName: 'thyuu-embed',
      formats: ['iife', 'es'],
    },
    emptyOutDir: true,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  plugins: [
    dts(),
    copy({
      targets: [
        {
          src: ['./dist/thyuu-embed.iife.js'],
          dest: fileURLToPath(new URL('../../src/main/resources/static', import.meta.url)),
        },
      ],
    }),
  ],
});
