// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'


// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//        target: 'http://0.0.0.0:8000/', // Django default port
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     },
//     port: 5173, // Vite default port
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'https://engiportal.onrender.com'
        target: 'https://stackhack.live', // Production Django
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    port: 5173,
  },
  define: {
    'import.meta.env.API_BASE_URL': JSON.stringify('https://engiportal.onrender.com')
  }
})