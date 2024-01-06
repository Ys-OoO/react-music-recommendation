import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //解决“vite use `--host` to expose”
  // base: '/', //不加打包后白屏
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/', //目标地址,这个目录里有api时，才需要重写
        changeOrigin: true, //是否换源
        rewrite: (path) => {
          return path.replace(/^\/api/, '')
        },
      },
    },
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src')
    }
  }
})
