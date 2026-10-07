import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { NotFoundPage } from '@/components/NotFoundPage';
import { THEME_BOOTSTRAP_SCRIPT, ThemeProvider } from '@/lib/theme-provider';

import 'cms-renderer/markdown.css';
import '@/app/globals.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'documentation' },
      { name: 'description', content: 'Built with MedianCMS' },
    ],
  }),
  component: RootRoute,
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
  errorComponent: RootError,
});

function RootRoute() {
  return <Outlet />;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // The script runs before paint so the saved color theme never flashes.
          // biome-ignore lint/security/noDangerouslySetInnerHtml: fixed local bootstrap constant, never user input
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootError({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <main
      data-docs-status=""
      className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6"
    >
      <h1 className="font-bold text-3xl text-[var(--text)]">Unable to load this page</h1>
      <p className="text-[var(--text-muted)]">{error.message}</p>
      <button
        className="rounded-md bg-[var(--accent)] px-4 py-2 text-white"
        onClick={() => router.invalidate()}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
