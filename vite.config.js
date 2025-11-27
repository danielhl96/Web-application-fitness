import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "offline.html",
      ],
      devOptions: { enabled: false },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: "/offline.html",
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "static-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkOnly", // Kein Caching für API
          },
        ],
      },
      manifest: {
        name: "Fitness App",
        short_name: "Fitness",
        description: "Fitness App to record and create your workouts",
        theme_color: "#ffffff",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        scope: "/",
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
          {
            src: "./squats.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple-touch-icon",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    hmr: {
      clientPort: 5173,
      host: "localhost",
    },
  },
});
