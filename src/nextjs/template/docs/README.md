# {{PROJECT_NAME}}

A documentation site on Next.js whose pages come from [Median CMS](https://app.mediancms.com): navbar with search, a sidebar grouped by category, Markdown articles with highlighted code, and light and dark themes.

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
| `src/lib/block-registry.ts` | `header`, `sidebar`, `content` and `footer` blocks → the docs components. |
| `src/lib/docs-page.server.ts` | Shapes each block once on the server (Markdown, sidebar sections, search entries). |
| `src/app/[[...slug]]/page.tsx` | Published pages, prerendered. |
| `src/app/cms-preview_/[[...slug]]/page.tsx` | The draft preview. |
| `src/proxy.ts` | Forwards `/admin` to Median; routes `?edit_mode=true` to the preview. |
| `src/generated/cms-schemas.ts` | Types for the docs components; refresh with `bun run generate-schemas`. |

## Scripts

| Command | |
| --- | --- |
| `bun dev` | Development server on http://localhost:3000 (admin panel at `/admin`). |
| `bun run build` | Prerender every published page. |
| `bun start` | Run the production build (`next start`). |
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
