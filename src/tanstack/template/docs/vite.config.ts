import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import type { DocsRouteData } from './src/lib/docs-page-data.ts';

/** The published pages `bun run generate-content` wrote; empty before the first run. */
async function readPages(): Promise<Record<string, DocsRouteData>> {
  try {
    return JSON.parse(await readFile(new URL('./.docs-content.json', import.meta.url), 'utf8'));
  } catch {
    return {};
  }
}

export default defineConfig(async () => {
  const pages = await readPages();
  const entry = '\0virtual:docs-content';
  return {
    plugins: [
      {
        name: 'docs-content',
        resolveId: (id: string) => (id === 'virtual:docs-content' ? entry : undefined),
        load: (id: string) =>
          id === entry ? `export const pages = ${JSON.stringify(pages)};` : undefined,
      },
      tanstackStart({
        // Every published page is prerendered to static HTML. `/cms-preview_…` (the CMS
        // draft preview) and `/admin` (the proxied admin panel) stay on the server.
        pages: [
          ...Object.keys(pages).map((path) => ({ path, prerender: { enabled: true } })),
          {
            path: '/404',
            prerender: { enabled: true, outputPath: '/404.html', autoSubfolderIndex: false },
          },
        ],
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
    ssr: { external: ['shiki'] },
  };
});
