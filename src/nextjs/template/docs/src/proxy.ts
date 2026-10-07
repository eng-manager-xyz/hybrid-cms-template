import { createCmsProxy } from 'cms-renderer/proxy';
import { type NextRequest, NextResponse } from 'next/server';

const cmsProxy = createCmsProxy({ upstream: process.env.MEDIAN_CMS_URL || undefined });

const isPreviewSearch = (url: URL) =>
  ['true', '1'].includes(url.searchParams.get('edit_mode') ?? '') ||
  Boolean(url.searchParams.get('ai_preview'));

export async function proxy(request: NextRequest) {
  // `/admin` and the requests it makes go to the Median admin panel.
  const cms = await cmsProxy(request);
  if (cms) return cms;

  // `?edit_mode=true` (the CMS editing a page in place) renders that page's draft.
  const url = request.nextUrl;
  if (isPreviewSearch(url) && !url.pathname.startsWith('/cms-preview_')) {
    const preview = url.clone();
    preview.pathname = `/cms-preview_${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(preview);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cms-assets/:path*',
    '/cms-fn/:path*',
    '/login',
    '/logout',
    '/monitoring/:path*',
    '/api/:path*',
    // The admin panel's root files, which `createCmsProxy` forwards only for an admin page.
    '/wasm/:path*',
    '/brand/:path*',
    '/favicon.svg',
    '/manifest.webmanifest',
    // Pages opened for in-place editing.
    { source: '/((?!_next|cms-preview_).*)', has: [{ type: 'query', key: 'edit_mode' }] },
    { source: '/((?!_next|cms-preview_).*)', has: [{ type: 'query', key: 'ai_preview' }] },
  ],
};
