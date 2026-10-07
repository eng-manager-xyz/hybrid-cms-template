import { z } from 'zod';
import { readPostApiIcon, readPostIconName } from './sidebar-icon-values';

const href = z.string().refine((value) => /^(?:\/(?!\/)|#|https?:\/\/|mailto:)/i.test(value));
const link = z.object({
  label: z.string(),
  href,
  active: z.boolean().optional(),
  icon: z.string().optional(),
  apiIcon: z.string().optional(),
});

const navigationLink = z.union([
  link,
  z
    .string()
    .trim()
    .min(1)
    .transform((label) => ({
      label,
      href: `/${encodeURIComponent(label.toLowerCase().replace(/\s+/g, '-'))}`,
    })),
]);

export const headerContent = z.object({
  nav_links: z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.flatMap((item) => {
        const result = navigationLink.safeParse(item);
        return result.success ? [result.data] : [];
      })
    ),
  search_entries: z
    .array(
      z.object({
        title: z.string(),
        href,
        category: z.string().catch(''),
        content: z.string().catch(''),
        headings: z.array(z.string()).catch([]),
      })
    )
    .catch([]),
});

/**
 * A post's category: plain text (`docs`), or a category document filled in
 * from a reference, which groups under its title and links by its URL slug.
 */
const postCategory = z
  .union([
    z.string().transform((slug) => ({ slug: slug.trim(), title: slug.trim() })),
    z
      .object({
        _slug: z.string().optional(),
        slug: z.string().optional(),
        _title: z.string().optional(),
        title: z.string().optional(),
      })
      .transform((category) => {
        const slug = (category._slug ?? category.slug ?? '').trim();
        return { slug, title: (category.title ?? category._title ?? slug).trim() };
      }),
  ])
  .catch({ slug: '', title: '' });

const sidebarPost = z.object({
  title: z.string().trim().min(1),
  _title: z.string().trim().catch(''),
  category: postCategory,
  icon: z.unknown().optional(),
  iconApi: z.unknown().optional(),
  icon_api: z.unknown().optional(),
});

type SidebarSection = { title: string; href: string | null; links: z.infer<typeof link>[] };

/**
 * Groups `sidebar_post` items by category, linking each to `/{category slug}/{title}`;
 * a section links to its category page, `/{category slug}`.
 */
export const sidebarPostContent = z
  .array(z.unknown())
  .catch([])
  .transform((items) => {
    const sections = new Map<string, SidebarSection>();
    for (const item of items) {
      const result = sidebarPost.safeParse(item);
      if (!result.success) continue;
      const { title, _title, category, icon, iconApi, icon_api } = result.data;
      const section = sections.get(category.slug) ?? {
        title: category.title || 'Other',
        href: category.slug ? `/${encodeURIComponent(category.slug)}` : null,
        links: [],
      };
      section.links.push({
        label: _title || title,
        href: `/${[category.slug, title].filter(Boolean).map(encodeURIComponent).join('/')}`,
        icon: readPostIconName(iconApi) ?? readPostIconName(icon_api),
        apiIcon: readPostApiIcon(icon),
      });
      sections.set(category.slug, section);
    }
    return [...sections.values()];
  });

const neighbor = z.object({ title: z.string(), href }).nullable().catch(null);
export const articleContent = z.object({
  title: z.string().catch(''),
  description: z.string().catch(''),
  content: z.string().catch(''),
  previous: neighbor,
  next: neighbor,
});
