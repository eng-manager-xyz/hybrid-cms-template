import { createFileRoute, notFound } from '@tanstack/react-router';
import { ParametricPreview } from 'cms-renderer';
import { loadDraftPage } from '@/lib/pages';
import { registry } from '@/lib/registry';

/** `/cms-preview_/<path>`: the live draft on every request, with the CMS edit overlay. */
export const Route = createFileRoute('/cms-preview_/$')({
  loader: async ({ params }) => {
    const result = await loadDraftPage(params._splat);
    if (result.kind !== 'page') throw notFound();
    return result;
  },
  head: () => ({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] }),
  component: function CmsPreview() {
    const { page, cmsUrl } = Route.useLoaderData();
    return <ParametricPreview page={page} registry={registry} cmsUrl={cmsUrl} />;
  },
});
