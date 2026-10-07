# create-median-app

Create a website powered by [Median CMS](https://app.mediancms.com), on **Next.js** (deploys to
Vercel) or **TanStack Start** (deploys to Vercel or any Node host).

```bash
bunx create-median-app my-site          # choose the framework and template
bunx create-median-next my-site         # Next.js
bunx create-median-tanstack my-site     # TanStack Start
```

Then:

```bash
cd my-site
cp .env.example .env   # set MEDIAN_WEBSITE_ID, MEDIAN_API_KEY and DATASET_ENDPOINT
bun dev
```

## Templates

| Template | What you get |
| --- | --- |
| `base` | An empty block registry and a welcome page at `/` until the CMS publishes one. |
| `docs` | A documentation site: navbar with search, sidebar grouped by category, Markdown articles with highlighted code, footer, light and dark themes. |

Pick one with `--template=base|docs` and the framework with `--framework=next|tanstack`.
Without a terminal (CI), the defaults are Next.js and `base`.

## How a generated site works

- **Published pages are static.** At build time the site lists every published URL
  (`median.listPages()`), reads each page (`median.resolveComponent(path)`) and prerenders it
  with `ParametricPage`. Unknown URLs are a 404.
- **The draft preview renders on request.** `/cms-preview_/<path>` reads the live draft and
  renders it with `ParametricPreview`, which adds the overlay the CMS Template Builder uses to
  select and edit blocks. Opening a page with `?edit_mode=true` shows its draft too.
- **The admin panel lives at `/admin`.** `createCmsProxy()` from `cms-renderer/proxy` forwards
  `/admin` and the requests it makes (its files, `/wasm` assets, server functions and API
  routes) to Median. Set the website's domain in the CMS (Settings → Websites) to use it on
  your own domain.
- **Publishing needs a rebuild.** Published changes reach the static pages on the next build;
  trigger one from the CMS deploy settings or a deploy hook.

Each template's README covers its files, environment variables and scripts.

## Options

| Flag | Effect |
| --- | --- |
| `--framework=next\|tanstack` | Skip the framework prompt. |
| `--template=base\|docs` | Skip the template prompt. |
| `--no-install` | Do not run `bun install`. |
| `--no-git` | Do not create a git repository. |

`MEDIAN_DEFAULT_FRAMEWORK=next|tanstack` sets the framework when the shortcut command cannot be
detected (some Windows shells).
