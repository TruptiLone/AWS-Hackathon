import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const apiKey = process.env.STUDENT_API_KEY

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://d25zzadgyf.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            if (apiKey) {
              proxyReq.setHeader('x-api-key', apiKey)
            }
          })
        },
      },
    },
  },
})
