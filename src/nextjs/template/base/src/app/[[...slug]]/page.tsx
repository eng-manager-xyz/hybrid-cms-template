import { ParametricPage } from 'cms-renderer';
import { notFound } from 'next/navigation';
import { Welcome } from '@/components/Welcome';
import { median, pathOf } from '@/lib/median';
import { registry } from '@/lib/registry';

// Every published page is prerendered at build time; other URLs are a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const paths = median ? await median.listPages() : [];
  // `/` is always built: the CMS home page, or the welcome page until there is one.
  return [...new Set(['/', ...paths])].map((path) => ({ slug: path.split('/').filter(Boolean) }));
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const path = pathOf((await params).slug);
  const page = median ? await median.resolveComponent(path) : null;
  if (page) return <ParametricPage page={page} registry={registry} />;
  if (path === '/') return <Welcome configured={Boolean(median)} />;
  notFound();
}
