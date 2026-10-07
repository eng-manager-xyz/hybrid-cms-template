import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/components/NotFoundPage';

export const Route = createFileRoute('/404')({
  head: () => ({
    meta: [{ title: '404 — Page not found' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: NotFoundPage,
});
