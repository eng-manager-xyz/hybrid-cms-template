import { articleContent } from './block-content';
import type { DocsRouteData } from './docs-page-data';

export function buildDocsRouteHead(data: DocsRouteData | undefined) {
  const content = articleContent.parse(
    data?.blocks.find((block) => block.component === 'content')?.content ?? {}
  );
  return {
    meta: [
      { title: typeof content?.title === 'string' ? content.title : 'documentation' },
      {
        name: 'description',
        content:
          typeof content?.description === 'string' ? content.description : 'Built with MedianCMS',
      },
      ...(data?.preview ? [{ content: 'noindex, nofollow', name: 'robots' }] : []),
    ],
  };
}
