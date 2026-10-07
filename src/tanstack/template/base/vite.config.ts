import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { Median } from 'cms-renderer';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';

/** Every published URL, so the build can prerender it; just `/` until Median is configured. */
async function publishedPaths(mode: string): Promise<string[]> {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  if (!env.MEDIAN_WEBSITE_ID || !env.DATASET_ENDPOINT) return ['/'];
  const median = new Median({
    apiKey: env.MEDIAN_API_KEY,
    datasetEndpoint: env.DATASET_ENDPOINT,
    websiteId: env.MEDIAN_WEBSITE_ID,
    registry: {},
  });
  return [...new Set(['/', ...(await median.listPages())])];
}

export default defineConfig(async ({ command, mode }) => {
  const paths = command === 'build' ? await publishedPaths(mode) : [];
  return {
    plugins: [
      tanstackStart({
        // Published pages are prerendered to static HTML; `/cms-preview_…` (the CMS draft
        // preview) and `/admin` (the proxied admin panel) stay on the server.
        pages: paths.map((path) => ({ path, prerender: { enabled: true } })),
        prerender: {
          enabled: true,
          autoStaticPathsDiscovery: false,
          crawlLinks: false,
          failOnError: true,
          autoSubfolderIndex: true,
        },
      }),
      nitro({
        preset: process.env.NITRO_PRESET ?? (process.env.VERCEL ? 'vercel' : 'node-server'),
      }),
      viteReact(),
      tailwindcss(),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 3000 },
  };
});
