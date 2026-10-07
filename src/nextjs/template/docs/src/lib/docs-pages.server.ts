import { getCmsConfig } from './cms-config.server';
import { toDocsRouteData } from './docs-page.server';
import type { DocsRouteData } from './docs-page-data';
import { getMedian } from './median.server';

/** The URL path of an optional catch-all route's segments. */
export const pathOf = (slug: string[] = []) => `/${slug.map(decodeURIComponent).join('/')}`;

/** A page resolved by Median and shaped for rendering: published, or the live draft. */
export async function loadDocsPage(
  path: string,
  options: { preview?: boolean } = {}
): Promise<DocsRouteData | null> {
  const page = await getMedian().resolveComponent(path, options);
  return page ? toDocsRouteData(page, getCmsConfig().cmsUrl) : null;
}
