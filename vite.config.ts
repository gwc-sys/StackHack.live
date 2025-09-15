import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",  
  server: {
    proxy: {
      '/api': {
        target: 'https://stackhack-live.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    port: 5173,
  },
  define: {
    'import.meta.env.API_BASE_URL': JSON.stringify('https://stackhack-live.onrender.com')
  }
})