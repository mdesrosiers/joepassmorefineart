import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://joepassmorefineart.com',
  output: 'static',
  trailingSlash: 'never',
  // 'file' emits dist/about.html instead of dist/about/index.html so Netlify
  // serves slash-less URLs (/about, /paintings/120) with 200 directly. With
  // 'directory', Netlify 301s the bare path to the trailing-slash form, which
  // Search Console flags as "Page with redirect".
  build: { format: 'file' },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        if (pathname === '/') {
          return { ...item, priority: 1.0, changefreq: 'monthly' };
        }
        if (pathname.startsWith('/paintings/')) {
          return { ...item, priority: 0.8, changefreq: 'yearly' };
        }
        return { ...item, priority: 0.5, changefreq: 'yearly' };
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
    build: {
      // Prevent Astro/Vite from inlining small JS chunks back into HTML.
      // CSP `script-src 'self'` cannot allow inline modules; we need
      // every component <script> to ship as an external /_astro/* file.
      assetsInlineLimit: 0,
    },
  },
});
