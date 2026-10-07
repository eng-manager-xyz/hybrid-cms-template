import { Image } from '@unpic/react';
import type { MarkdownCard } from 'cms-renderer/markdown';
import type { ReactNode } from 'react';
import { renderSidebarIcon } from './sidebar-icons.server';

/** `/icons/<name>.svg` or `/icons/solid/<name>.svg`: a Heroicon by name. */
const HEROICON_PATH = /^\/icons\/(?:(solid)\/)?([a-z0-9]+(?:-[a-z0-9]+)*)\.svg$/;

async function CardIcon({ src, alt }: MarkdownCard['icon']) {
  const heroicon = HEROICON_PATH.exec(src);
  const icon =
    heroicon && (await renderSidebarIcon(`${heroicon[1] ?? 'outline'}:${heroicon[2]}`));
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)] [&_svg]:size-5 [&_svg]:text-current">
      {icon ? (
        <span aria-hidden="true" className="flex">
          {icon}
        </span>
      ) : (
        <img alt={alt} className="size-5 object-contain" src={src} />
      )}
    </span>
  );
}

/** A markdown card: `[![](/icons/key.svg "API keys") Authentication](/docs/auth)`. */
async function renderCard({ href, title, description, icon }: MarkdownCard) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      className="group not-prose my-3 flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-muted)]"
      href={href}
      {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
    >
      {await CardIcon(icon)}
      <span className="min-w-0">
        <span className="block font-semibold text-[var(--text)] text-base transition-colors group-hover:text-[var(--accent)]">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[var(--text-muted)] text-sm">{description}</span>
        ) : null}
      </span>
    </a>
  );
}

/** A list of cards, two columns from small screens up. */
function renderCardGrid(cards: React.ReactNode[]) {
  return <div className="my-4 grid gap-3 sm:grid-cols-2 [&>a]:my-0">{cards}</div>;
}

/** CMS Markdown as React elements, rendered on the server. */
export async function renderMarkdown(markdown: string): Promise<ReactNode> {
  if (!markdown) {
    return null;
  }
  const { Markdown } = await import('cms-renderer/markdown');
  const node = await Markdown({
    content: markdown,
    renderCard,
    renderCardGrid,
    renderCodeAction: ({ code }) => (
      <button
        aria-label="Copy code"
        className="absolute top-3 right-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-[var(--text-soft)] transition hover:text-[var(--text-muted)]"
        data-docs-copy-code={code}
        title="Copy code"
        type="button"
      >
        <span aria-hidden="true">⧉</span>
      </button>
    ),
    renderImage: ({ src, alt, title, loading }) => (
      <button
        className="block w-full cursor-zoom-in"
        data-docs-image={src}
        data-docs-image-alt={alt}
        data-docs-image-title={title}
        type="button"
      >
        <Image
          alt={alt}
          className="h-auto max-w-full rounded-xl"
          height={900}
          layout="constrained"
          loading={loading}
          src={src}
          title={title}
          width={1600}
        />
      </button>
    ),
  });
  return node;
}
