import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    cors: true,  
    host: 'localhost',
    port: 5173,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  
})
