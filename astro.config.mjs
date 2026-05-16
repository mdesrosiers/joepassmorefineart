import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://joepassmorefineart.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        if (item.url === 'https://joepassmorefineart.com/') {
          return { ...item, priority: 1.0, changefreq: 'monthly' };
        }
        if (item.url.includes('/paintings/')) {
          return { ...item, priority: 0.8, changefreq: 'yearly' };
        }
        return { ...item, priority: 0.5, changefreq: 'yearly' };
      },
    }),
  ],
  vite: { plugins: [tailwind()] },
});
