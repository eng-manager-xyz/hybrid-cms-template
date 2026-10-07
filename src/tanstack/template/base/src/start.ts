import { createMiddleware, createStart } from '@tanstack/react-start';
import { createCmsProxy } from 'cms-renderer/proxy';

const proxy = createCmsProxy({ upstream: process.env.MEDIAN_CMS_URL || undefined });

/** `/admin` and the requests it makes go to the Median admin panel; the rest is the docs. */
const cmsProxyMiddleware = createMiddleware().server(
  async ({ request, next }) => (await proxy(request)) ?? next()
);

export const startInstance = createStart(() => ({
  requestMiddleware: [cmsProxyMiddleware],
}));
