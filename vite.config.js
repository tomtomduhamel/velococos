import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'icon.svg',
        'gpx/traces_fusionnees.json',
        'documents/reservation-camping-plage-st-raymond.pdf',
        'documents/facture-lac-simon.pdf',
        'documents/consignes-sejour-lac-simon.pdf'
      ],
      manifest: {
        name: 'Vélococos - Expédition Québec 2026',
        short_name: 'Vélococos',
        description: 'Application logistique et cartographique 100% hors-ligne pour expédition vélo-course',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/favicon.svg',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        // Pré-cache tous les assets de l'application, traces JSON et preuves PDF
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,pdf}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            // Cache agressif des tuiles cartographiques OpenStreetMap
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles-cache',
              expiration: {
                maxEntries: 5000,
                maxAgeSeconds: 60 * 60 * 24 * 60 // 60 jours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache des requêtes Supabase REST en cas d'appels directs
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 jours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
