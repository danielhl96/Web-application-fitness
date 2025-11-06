import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Fitness App",
        short_name: "Fitness",
        description: "Fitness App to record and create your workouts",
        theme_color: "#ffffff",
        icons: [
          {
            src: "./squats.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./squats.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
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
