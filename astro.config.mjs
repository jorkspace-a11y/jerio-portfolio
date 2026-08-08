// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://whatmattersbuilt.co',
  integrations: [sitemap({
    // /writing/ is a compatibility redirect to /field-notes/, not a real
    // page — it must stay reachable (crawlers still hit old links) but
    // never compete with the canonical URL for indexing.
    filter: (page) => !page.includes('/writing/'),
  }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});