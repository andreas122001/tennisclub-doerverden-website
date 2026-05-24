// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { cpSync, existsSync, mkdirSync } from 'node:fs';

/** Vite plugin: copies public/uploads/ → src/assets/uploads/ before build and on dev start. */
function syncUploads() {
  function sync() {
    if (!existsSync('public/uploads')) return;
    mkdirSync('src/assets/uploads', { recursive: true });
    cpSync('public/uploads', 'src/assets/uploads', { recursive: true });
  }
  return {
    name: 'sync-uploads',
    buildStart: sync,
    configureServer: sync,
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://tennisclub-doerverden.de',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), syncUploads()]
  }
});