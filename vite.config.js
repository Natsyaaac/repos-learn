import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // WAJIB untuk ngrok
    strictPort: true, // Jangan ganti port otomatis
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws', // Force WebSocket
      timeout: 60 * 1000, // Timeout lebih lama
    },
    cors: true, // Enable CORS
  }
})
