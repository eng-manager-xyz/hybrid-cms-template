import type { BlockComponentProps } from 'cms-renderer';
import { useId } from 'react';
import { resolveBlockAppearance } from '@/lib/block-layout';
import type { ArticleView } from '@/lib/block-views';
import { AppLink } from './AppLink';
import { CopyContentControls } from './CopyContentControls';
import { DocsTableOfContents } from './DocsTableOfContents';
import { RenderedMarkdown } from './RenderedMarkdown';

export default function UIContent({ content, layout }: Readonly<BlockComponentProps<ArticleView>>) {
  const appearance = resolveBlockAppearance(content, layout);
  const headingAlignmentClasses = appearance.hasConfiguredAlignment
    ? [appearance.itemsClass, appearance.justifyClass]
    : ['items-start', 'justify-between'];
  const markdownContentId = `docs-content-${useId()}`;

  return (
    <div
      className={[
        'min-h-screen min-w-0 px-4 pt-8 pb-20 font-sans sm:px-6 lg:px-8 lg:pt-10 lg:pb-48',
        appearance.backgroundClass,
        appearance.textAlignClass,
      ].join(' ')}
      data-cms-live-background=""
      data-cms-live-default-background="var(--background)"
      style={appearance.style}
    >
      <div
        className={['mx-auto flex w-full min-w-0 max-w-[80rem] gap-12', appearance.placementClass]
          .filter(Boolean)
          .join(' ')}
        data-cms-live-placement=""
      >
        <div className="min-w-0 max-w-[48rem] flex-1">
          <div className="mb-8">
            <div
              className={['flex flex-wrap gap-4', ...headingAlignmentClasses].join(' ')}
              data-cms-live-alignment=""
            >
              <div className="min-w-0 max-w-2xl">
                <h1 className="break-words font-bold text-3xl text-[var(--text)]">
                  {content.title}
                </h1>
                {content.description ? (
                  <p className="mt-1 font-semibold text-[13px] text-[var(--text-muted)]">
                    {content.description}
                  </p>
                ) : null}
              </div>
              {content.content ? (
                <CopyContentControls
                  contentElementId={markdownContentId}
                  markdown={content.content}
                />
              ) : null}
            </div>
          </div>

          {content.content ? (
            <div id={markdownContentId}>
              <RenderedMarkdown html={content.markdownHtml} />
            </div>
          ) : content.notMarkdown ? (
            <p className="text-[var(--text-muted)]">
              This document content is not stored as Markdown yet. Re-save it in the rich text
              editor to render it here.
            </p>
          ) : (
            <p className="text-[var(--text-muted)]">No content available.</p>
          )}

          {content.previous || content.next ? (
            <div className="mt-16 border-[var(--border)] border-t pt-6">
              <div className="mb-4 font-semibold text-[11px] text-[var(--text-muted)] uppercase tracking-[0.24em]">
                Continue Reading
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.previous ? (
                  <AppLink
                    className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-muted)]"
                    href={content.previous.href}
                    title="Go to previous page"
                  >
                    <span className="mb-3 block font-semibold text-[11px] text-[var(--text-muted)] uppercase tracking-[0.22em] transition-colors group-hover:text-[var(--accent)]">
                      Previous
                    </span>
                    <span className="flex items-center gap-2 text-[var(--text)] text-base">
                      <span>‹</span>
                      <span>{content.previous.title}</span>
                    </span>
                  </AppLink>
                ) : (
                  <div className="hidden sm:block" />
                )}
                {content.next ? (
                  <AppLink
                    className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-muted)] sm:text-right"
                    href={content.next.href}
                    title="Go to next page"
                  >
                    <span className="mb-3 block font-semibold text-[11px] text-[var(--text-muted)] uppercase tracking-[0.22em] transition-colors group-hover:text-[var(--accent)]">
                      Next
                    </span>
                    <span className="flex items-center justify-end gap-2 text-[var(--text)] text-base">
                      <span>{content.next.title}</span>
                      <span>›</span>
                    </span>
                  </AppLink>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            </div>
          ) : null}
        </div>
        {content.content ? (
          <aside
            aria-label="On this page"
            className="sticky hidden w-56 shrink-0 self-start xl:block"
            style={{ top: 'calc(var(--docs-nav-height) + 2.5rem)' }}
          >
            <DocsTableOfContents contentId={markdownContentId} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
