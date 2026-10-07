import type { ResolvedPage } from 'cms-renderer';
import { articleContent, headerContent, sidebarPostContent } from './block-content';
import type {
  ArticleView,
  FooterView,
  HeaderView,
  SidebarView,
  SocialNetwork,
} from './block-views';
import type { DocsRouteData } from './docs-page-data';
import { linkHref } from './link-href';
import { renderMarkdownHtml } from './markdown.server';
import { renderSidebarIconSvg } from './sidebar-icons.server';

type Content = Record<string, unknown>;

async function article(content: Content): Promise<ArticleView> {
  const view = articleContent.parse(content);
  return {
    ...view,
    markdownHtml: await renderMarkdownHtml(view.content),
    notMarkdown: content.content != null && typeof content.content !== 'string',
  };
}

/** Whether a header link is the section `path` is in: `/tutorials` covers `/tutorials/intro`. */
export function isActiveNavHref(href: string, path: string): boolean {
  const trim = (value: string) => (value.length > 1 ? value.replace(/\/+$/, '') : value);
  const link = trim(href.split(/[?#]/)[0] ?? '');
  const current = trim(path);
  if (!link.startsWith('/')) return false;
  if (link === '/') return current === '/';
  return current === link || current.startsWith(`${link}/`);
}

function header(content: Content, path: string): HeaderView {
  const view = headerContent.parse(content);
  return {
    ...view,
    nav_links: view.nav_links.map((link) => ({
      ...link,
      active: isActiveNavHref(link.href, path),
    })),
  };
}

async function sidebar(content: Content, path: string): Promise<SidebarView> {
  const sections = sidebarPostContent.parse(content.sidebar_post);
  return {
    sections: await Promise.all(
      sections.map(async (section) => ({
        title: section.title,
        href: section.href,
        current: section.href === path,
        active:
          (section.href !== null && isActiveNavHref(section.href, path)) ||
          section.links.some((link) => link.href === path),
        links: await Promise.all(
          section.links.map(async ({ label, href, icon, apiIcon }) => {
            const badge = apiIcon && apiIcon !== 'custom' ? apiIcon : null;
            return {
              label,
              href,
              active: href === path,
              apiBadge: badge,
              iconSvg: badge ? null : await renderSidebarIconSvg(icon),
            };
          })
        ),
      }))
    ),
  };
}

const SOCIAL: [SocialNetwork, string][] = [
  ['x', 'x_url'],
  ['github', 'github_url'],
  ['linkedin', 'linkedin_url'],
];

function footer(content: Content): FooterView {
  return {
    social_links: SOCIAL.flatMap(([network, field]) => {
      const href = linkHref(content[field]);
      return href ? [{ network, href }] : [];
    }),
  };
}

/** Each block's view props, merged over its stored content (which keeps layout fields). */
async function view(type: string, content: Content, path: string): Promise<object | null> {
  switch (type) {
    case 'header':
      return header(content, path);
    case 'content':
      return article(content);
    case 'sidebar':
      return sidebar(content, path);
    case 'footer':
      return footer(content);
    default:
      return null;
  }
}

/**
 * One API response → the props the docs page renders. Blocks keep exactly the
 * content the API returns (stored values and CEL results); each docs block also
 * gets its view shaped here once, so components only render. Nothing is fetched.
 */
export async function toDocsRouteData(page: ResolvedPage, cmsUrl: string): Promise<DocsRouteData> {
  const blocks = await Promise.all(
    page.blocks.map(async (block) => {
      const shaped = await view(block.type, block.content, page.path);
      return shaped ? { ...block, content: { ...block.content, ...shaped } } : block;
    })
  );
  return { ...page, blocks, cmsUrl };
}
