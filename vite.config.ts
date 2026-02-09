import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Proxy any request starting with /api to Spring Boot backend
      '/api': {
        target: 'http://localhost:8080/api/v1',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
