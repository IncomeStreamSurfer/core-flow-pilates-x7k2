// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: process.env.PUBLIC_SITE_URL || 'https://core-flow-x7k2.vercel.app',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api/') && !page.includes('/checkout/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
