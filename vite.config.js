import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // <-- Neu: Erlaubt Zugriff über Netzwerk (nicht nur localhost)
    port: 5173,
    proxy: {
      "/api": {
        target: "http://192.168.2.36:5000", // <-- Ändere zu deiner PC-IP-Adresse (siehe Schritt 2)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
