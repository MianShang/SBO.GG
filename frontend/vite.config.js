import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
  // 프론트에서 /api로 시작하는 요청 들어올 시 백엔드로 전달
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/riot': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
