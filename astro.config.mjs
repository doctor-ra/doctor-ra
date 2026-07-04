// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkBasePath } from './src/remark-base-path.mjs';

const base = '/doctor-ra';

// https://astro.build/config
export default defineConfig({
  site: 'https://doctor-ra.github.io',
  base,
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkBasePath(base)],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
