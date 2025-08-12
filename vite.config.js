import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    host: '0.0.0.0', // Bindet an alle IP-Adressen im Netzwerk
    port: 3000, // Port, den du verwenden möchtest
  }
})
