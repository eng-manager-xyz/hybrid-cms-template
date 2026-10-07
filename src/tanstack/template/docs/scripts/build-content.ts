import { writeFile } from 'node:fs/promises';
import { buildDocsContent } from './docs-content';

// Every published page, resolved once: the build prerenders them from this snapshot.
try {
  const pages = await buildDocsContent();
  await writeFile(new URL('../.docs-content.json', import.meta.url), JSON.stringify(pages));
} catch (error) {
  console.error(
    '[docs build] Could not read the published pages. Check MEDIAN_WEBSITE_ID and MEDIAN_API_KEY, and that the site has published pages.',
    error instanceof Error ? error.message : ''
  );
  process.exitCode = 1;
}
