# {{PROJECT_NAME}}

A website on TanStack Start whose pages come from [Median CMS](https://app.mediancms.com).

```bash
cp .env.example .env
bun dev
```

## How it works

- **Published pages are static.** The build lists every published URL and prerenders it.
  Unknown URLs are a 404.
- **`/cms-preview_/<path>`** renders the live draft on every request with the overlay the CMS
  Template Builder uses to select and edit blocks; `?edit_mode=true` on any page does the same.
- **`/admin`** opens the Median admin panel on your own domain: `createCmsProxy()` from
  `cms-renderer/proxy` forwards the panel and the requests it makes (its files, `/wasm`
  assets, server functions and API routes). Set your domain in the CMS (Settings → Websites).
- **Publishing needs a rebuild** for the static pages to change.

## Files

| File | |
| --- | --- |
| `src/lib/registry.ts` | CMS UI element name → your React component. Start here. |
| `src/lib/median.server.ts` | The `Median` client (server-only). |
| `src/routes/$.tsx` | Published pages (`ParametricPage`); prerendered from the list in `vite.config.ts`. |
| `src/routes/[cms-preview_].$.tsx` | The draft preview (`ParametricPreview`). |
| `src/start.ts` | Forwards `/admin` to Median. |
| `src/components/Welcome.tsx` | Shown at `/` until the CMS publishes a home page. |

## Scripts

| Command | |
| --- | --- |
| `bun dev` | Development server on http://localhost:3000 (admin panel at `/admin`). |
| `bun run build` | Prerender every published page. |
| `bun start` | Run the production build (`bun .output/server/index.mjs`). |
| `bun run generate-schemas` | Write Zod schemas and types for the website's components to `src/generated/`. |

## Environment

Copy `.env.example` to `.env`:

| Variable | |
| --- | --- |
| `MEDIAN_WEBSITE_ID` | The website, from the CMS (Settings → Websites). |
| `MEDIAN_API_KEY` | A read key (`content_read`). Server-only; it also reads drafts for the preview, so do not commit it. |
| `MEDIAN_CMS_URL` | Optional: the admin panel `/admin` forwards to (default `https://app.mediancms.com`). |
| `DATASET_ENDPOINT` | The Median page service URL. |

On Vercel, set the same variables in the project settings.
