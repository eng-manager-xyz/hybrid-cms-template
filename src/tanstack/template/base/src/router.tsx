import { createRouter } from '@tanstack/react-router';
import { previewRewrite } from './lib/preview-rewrite';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createRouter({
    defaultPreload: 'intent',
    // `?edit_mode=true` (the CMS editing a page in place) renders that page's draft.
    rewrite: previewRewrite,
    routeTree,
    scrollRestoration: true,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
