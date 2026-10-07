import { ParametricPage, ParametricPreview } from 'cms-renderer';
import { docsBlockRegistry } from '@/lib/block-registry';
import type { DocsRouteData } from '@/lib/docs-page-data';

/** A published page, or a draft inside the CMS with its edit overlay. */
export function DocsRoutePage({ data }: { data: DocsRouteData }) {
  return data.preview ? (
    <ParametricPreview cmsUrl={data.cmsUrl} page={data} registry={docsBlockRegistry} />
  ) : (
    <ParametricPage page={data} registry={docsBlockRegistry} />
  );
}
