/**
 * Block content as the docs components receive it: shaped once by
 * `toDocsRouteData` (build or draft request), so components only render.
 */
import type { SearchEntry } from './search-index';

export interface NavLinkView {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderView {
  nav_links: NavLinkView[];
  search_entries: SearchEntry[];
}

export interface ArticleView {
  title: string;
  description: string;
  /** Raw markdown, for the copy controls. */
  content: string;
  markdownHtml: string;
  /** The stored content is rich text that has not been re-saved as Markdown. */
  notMarkdown: boolean;
  previous: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
}

export interface SidebarLinkView {
  label: string;
  href: string;
  active: boolean;
  /** HTTP method badge (`get`, `post`, …). */
  apiBadge: string | null;
  /** Pre-rendered Heroicon SVG markup. */
  iconSvg: string | null;
}

export interface SidebarSectionView {
  title: string;
  /** The category page, `/{category slug}`; `null` for uncategorized posts. */
  href: string | null;
  /** The category page is the current page. */
  current: boolean;
  /** The current page is the category page or one of its posts: the section starts open. */
  active: boolean;
  links: SidebarLinkView[];
}

export interface SidebarView {
  sections: SidebarSectionView[];
}

export type SocialNetwork = 'x' | 'github' | 'linkedin';

export interface FooterView {
  social_links: { network: SocialNetwork; href: string }[];
}
