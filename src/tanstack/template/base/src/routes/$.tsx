import { createFileRoute, notFound } from '@tanstack/react-router';
import { ParametricPage } from 'cms-renderer';
import { Welcome } from '@/components/Welcome';
import { loadPublishedPage } from '@/lib/pages';
import { registry } from '@/lib/registry';

/** Every published page (prerendered at build time); `/` shows a welcome until it is published. */
export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const result = await loadPublishedPage(params._splat);
    if (result.kind === 'missing') throw notFound();
    return result;
  },
  component: function CmsPage() {
    const result = Route.useLoaderData();
    if (result.kind === 'welcome') return <Welcome configured={result.configured} />;
    if (result.kind !== 'page') return null;
    return <ParametricPage page={result.page} registry={registry} />;
  },
});
