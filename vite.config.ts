/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/omdb': {
        target: 'https://www.omdbapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/omdb/, ''),
        secure: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true
  }
})

