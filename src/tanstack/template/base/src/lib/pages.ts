import { createServerFn } from '@tanstack/react-start';
import type { ResolvedPage } from 'cms-renderer';

export type LoadedPage =
  | { kind: 'page'; page: ResolvedPage; cmsUrl: string }
  | { kind: 'welcome'; configured: boolean }
  | { kind: 'missing' };

/** A page resolved by Median on the server (the API key never leaves it). */
const loadPage = createServerFn({ method: 'GET', strict: false })
  .validator((input: { path: string; preview: boolean }) => input)
  .handler(async ({ data }): Promise<LoadedPage> => {
    const { cmsUrl, median } = await import('./median.server');
    const page = await median?.resolveComponent(data.path, { preview: data.preview });
    if (page) return { kind: 'page', page, cmsUrl };
    if (data.path === '/' && !data.preview) return { kind: 'welcome', configured: Boolean(median) };
    return { kind: 'missing' };
  });

/** The splat of a catch-all route as a URL path. */
export const pathOf = (splat = '') => `/${splat.split('/').filter(Boolean).join('/')}`;

export const loadPublishedPage = (splat?: string) =>
  loadPage({ data: { path: pathOf(splat), preview: false } });

export const loadDraftPage = (splat?: string) =>
  loadPage({ data: { path: pathOf(splat), preview: true } });
