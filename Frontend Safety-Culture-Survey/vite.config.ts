import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore - @tailwindcss/vite doesn't have TypeScript declarations yet
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /api requests ไปยัง backend
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
