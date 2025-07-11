import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'YEE Africa',
        short_name: 'YEE',
        description: 'Find internships and job opportunities across Africa.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1a202c',
        icons: [
          {
            src: '/logowhite.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logowhite.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
