import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsRoutePage } from '@/components/DocsRoutePage';
import { loadDocsPage, pathOf } from '@/lib/docs-pages.server';
import { getMedian } from '@/lib/median.server';
import { metadataFor } from '@/lib/route-head';

// Every published page is prerendered at build time; other URLs are a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const paths = await getMedian().listPages();
  return paths.map((path) => ({ slug: path.split('/').filter(Boolean) }));
}

type PageProps = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return metadataFor(await loadDocsPage(pathOf((await params).slug)));
}

export default async function Page({ params }: PageProps) {
  const page = await loadDocsPage(pathOf((await params).slug));
  if (!page) notFound();
  return <DocsRoutePage data={page} />;
}
