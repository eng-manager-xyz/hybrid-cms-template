import type { Metadata } from 'next';
import { articleContent } from './block-content';
import type { DocsRouteData } from './docs-page-data';

/** The page's title and description, from its article block. */
export function metadataFor(data: DocsRouteData | null): Metadata {
  const content = articleContent.parse(
    data?.blocks.find((block) => block.component === 'content')?.content ?? {}
  );
  return {
    title: content.title || 'documentation',
    description: content.description || 'Built with Median',
    ...(data?.preview ? { robots: { index: false, follow: false } } : {}),
  };
}
