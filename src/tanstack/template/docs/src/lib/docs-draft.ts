import { createServerFn } from '@tanstack/react-start';
import type { DocsRouteData } from './docs-page-data';

/** The page's live draft, resolved by Median on the server (the API key never leaves it). */
const loadDraftDocsPage = createServerFn({ method: 'GET', strict: false })
  .validator((path: string) => path)
  .handler(async ({ data: path }): Promise<DocsRouteData | null> => {
    const [{ getMedian }, { getCmsConfig }, { toDocsRouteData }] = await Promise.all([
      import('./median.server'),
      import('./cms-config.server'),
      import('./docs-page.server'),
    ]);
    const page = await getMedian().resolveComponent(path, { preview: true });
    return page ? toDocsRouteData(page, getCmsConfig().cmsUrl) : null;
  });

/** `/cms-preview_…`: the draft, read on every request (never cached). */
export async function loadPreviewDocsPage(splat = ''): Promise<DocsRouteData | undefined> {
  const path = `/${splat.split('/').filter(Boolean).join('/')}`;
  return (await loadDraftDocsPage({ data: path })) ?? undefined;
}
