# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-07

### Changed

- Renamed to `create-median-app`, with `create-median-next` and `create-median-tanstack`
  shortcuts.
- All four templates use `cms-renderer` 2: the `Median` client, `ParametricPage` and
  `ParametricPreview`.
- Published pages are prerendered to static HTML; only the draft preview
  (`/cms-preview_/<path>`) and the proxied admin panel render on request.
- The admin panel proxy uses `cms-renderer/proxy`, which forwards the panel's files, `/wasm`
  assets, server functions and API routes, so no per-site path lists or workarounds are needed.
- The docs templates follow the current Median docs site: categories from the sidebar block,
  search, Markdown with highlighted code and cards, light and dark themes.
- Environment variables are now `MEDIAN_WEBSITE_ID`, `MEDIAN_API_KEY`, `DATASET_ENDPOINT` and the
  optional `MEDIAN_CMS_URL`; the API key stays on the server.
