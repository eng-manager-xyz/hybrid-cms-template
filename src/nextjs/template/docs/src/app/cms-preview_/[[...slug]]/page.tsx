import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsRoutePage } from '@/components/DocsRoutePage';
import { loadDocsPage, pathOf } from '@/lib/docs-pages.server';
import { metadataFor } from '@/lib/route-head';

// `/cms-preview_/<path>`: the live draft on every request, with the CMS edit overlay.
export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return metadataFor(await loadDocsPage(pathOf((await params).slug), { preview: true }));
}

export default async function PreviewPage({ params }: PageProps) {
  const page = await loadDocsPage(pathOf((await params).slug), { preview: true });
  if (!page) notFound();
  return <DocsRoutePage data={page} />;
}
