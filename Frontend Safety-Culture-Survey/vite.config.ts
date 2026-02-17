import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore - @tailwindcss/vite doesn't have TypeScript declarations yet
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    watch: {
      usePolling: true, // Enable polling for Docker
    },
    hmr: {
      host: 'localhost', // HMR host
      port: 5173,
    },
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
