import { pages } from 'virtual:docs-content';
import type { DocsRouteData } from './docs-page-data';

/** A published page from the build's content snapshot (`bun run generate-content`). */
export function getSnapshotPage(path: string): DocsRouteData | undefined {
  return pages[path];
}
