import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLoading } from '@/components/DocsLoading';
import { DocsRoutePage } from '@/components/DocsRoutePage';
import { loadPreviewDocsPage } from '@/lib/docs-draft';
import { buildDocsRouteHead } from '@/lib/route-head';
import { normalizeDocsRouteSearch } from '@/lib/route-search';

export const Route = createFileRoute('/cms-preview_/$')({
  validateSearch: normalizeDocsRouteSearch,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ params }) => {
    const page = await loadPreviewDocsPage(params._splat);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => buildDocsRouteHead(loaderData),
  pendingComponent: DocsLoading,
  component: PreviewDocsPage,
});

function PreviewDocsPage() {
  return <DocsRoutePage data={Route.useLoaderData()} />;
}
