import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLoading } from '@/components/DocsLoading';
import { DocsRoutePage } from '@/components/DocsRoutePage';
import { getDocsPage } from '@/lib/docs-content';
import { buildDocsRouteHead } from '@/lib/route-head';
import { normalizeDocsRouteSearch } from '@/lib/route-search';

export const Route = createFileRoute('/$')({
  validateSearch: normalizeDocsRouteSearch,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ params }) => {
    const page = await getDocsPage(params._splat);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => buildDocsRouteHead(loaderData),
  pendingComponent: DocsLoading,
  component: CatchAllDocsPage,
});

function CatchAllDocsPage() {
  return <DocsRoutePage data={Route.useLoaderData()} />;
}
