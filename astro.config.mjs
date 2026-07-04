// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://doctor-ra.github.io',
  base: '/doctor-ra',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
