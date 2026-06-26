import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";

const isDev = process.env.NODE_ENV === "development";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    ...(isDev ? [keystatic()] : []),
  ],
  vite: {
    ssr: {
      external: ['pdfkit'],
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three/')) return 'three-core';
            // Keep React in shared chunk so all islands use same instance
            if (id.includes('node_modules/react-dom/')) return 'react-vendor';
            if (id.includes('node_modules/react/') && !id.includes('react-dom')) return 'react-vendor';
          },
        },
      },
    },
  },
});
