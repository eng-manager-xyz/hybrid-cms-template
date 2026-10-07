import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { THEME_BOOTSTRAP_SCRIPT } from '@/lib/theme-bootstrap';
import { ThemeProvider } from '@/lib/theme-provider';

import 'cms-renderer/markdown.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'documentation',
  description: 'Built with Median',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: fixed local bootstrap constant, never user input
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
