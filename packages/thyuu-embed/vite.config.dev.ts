import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  server: {
    proxy: {
      '/apis': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
});
