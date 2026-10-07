import type { ResolvedPage } from 'cms-renderer';

/** A page as the docs render it: resolved by Median, each block's view shaped once on the server. */
export interface DocsRouteData extends ResolvedPage {
  /** The CMS origin, for the preview's edit overlay. */
  cmsUrl: string;
}
