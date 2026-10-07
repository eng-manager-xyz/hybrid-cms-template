import type { LocationRewrite } from '@tanstack/react-router';

const PREVIEW_PREFIX = '/cms-preview_';

function hasPreviewSearch(url: URL): boolean {
  const editMode = url.searchParams.get('edit_mode');
  return editMode === 'true' || editMode === '1' || Boolean(url.searchParams.get('ai_preview'));
}

function isPreviewPath(pathname: string): boolean {
  return pathname === PREVIEW_PREFIX || pathname.startsWith(`${PREVIEW_PREFIX}/`);
}

/** Keep the public URL stable while routing preview requests through dynamic routes. */
export const previewRewrite: LocationRewrite = {
  input: ({ url }) => {
    if (!hasPreviewSearch(url) || isPreviewPath(url.pathname)) {
      return undefined;
    }
    const rewritten = new URL(url);
    rewritten.pathname = `${PREVIEW_PREFIX}${url.pathname}`;
    return rewritten;
  },
  output: ({ url }) => {
    if (!hasPreviewSearch(url) || !isPreviewPath(url.pathname)) {
      return undefined;
    }
    const rewritten = new URL(url);
    rewritten.pathname = url.pathname.slice(PREVIEW_PREFIX.length) || '/';
    return rewritten;
  },
};
