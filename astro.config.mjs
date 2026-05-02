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
});
