// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
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
// import fs from 'fs' // https support

export default defineConfig({
  plugins: [react()],
  server: {
    // https: { // https support
    //   key: fs.readFileSync('key.pem'),
    //   cert: fs.readFileSync('cert.pem'),
    // },
    proxy: {
      '/api': {
        target: 'https://engiportal.onrender.com', // Production Django
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