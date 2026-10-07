import { createServerFn } from '@tanstack/react-start';
import type { DocsRouteData } from './docs-page-data';

const readPage = createServerFn({ method: 'GET', strict: false })
  .validator((path: string) => path)
  .handler(async ({ data: path }): Promise<DocsRouteData | null> => {
    const { getSnapshotPage } = await import('./docs-snapshot.server');
    return getSnapshotPage(path) ?? null;
  });

/** Read the build's content snapshot. Page requests never fetch CMS content. */
export async function getDocsPage(slug = ''): Promise<DocsRouteData | undefined> {
  const path = `/${slug.split('/').filter(Boolean).join('/')}`;
  return (await readPage({ data: path })) ?? undefined;
}
