import { getCmsConfig } from '../src/lib/cms-config.server';
import { toDocsRouteData } from '../src/lib/docs-page.server';
import type { DocsRouteData } from '../src/lib/docs-page-data';
import { getMedian } from '../src/lib/median.server';

/** Every published page, resolved by Median (one request each) and shaped for rendering. */
export async function buildDocsContent(): Promise<Record<string, DocsRouteData>> {
  const median = getMedian();
  const { cmsUrl } = getCmsConfig();
  const pages = await Promise.all(
    (await median.listPages()).map(async (path) => {
      const page = await median.resolveComponent(path);
      return page ? ([path, await toDocsRouteData(page, cmsUrl)] as const) : null;
    })
  );
  const snapshots = Object.fromEntries(pages.filter((page) => page !== null));
  if (!Object.keys(snapshots).length) throw new Error('The CMS returned no published docs pages.');
  console.log(`[docs build] Prepared ${Object.keys(snapshots).length} static pages`);
  return snapshots;
}
