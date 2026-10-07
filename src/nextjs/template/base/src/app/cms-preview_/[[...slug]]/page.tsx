import { ParametricPreview } from 'cms-renderer';
import { notFound } from 'next/navigation';
import { cmsUrl, median, pathOf } from '@/lib/median';
import { registry } from '@/lib/registry';

// `/cms-preview_/<path>`: the live draft on every request, with the CMS edit overlay.
export const dynamic = 'force-dynamic';

export const metadata = { robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const page = await median?.resolveComponent(pathOf((await params).slug), { preview: true });
  if (!page) notFound();
  return <ParametricPreview page={page} registry={registry} cmsUrl={cmsUrl} />;
}
