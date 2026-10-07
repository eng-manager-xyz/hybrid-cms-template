import type { BlockComponentProps } from 'cms-renderer';
import type { Header } from '@/generated/cms-schemas';
import { resolveBlockAppearance } from '@/lib/block-layout';
import type { HeaderView } from '@/lib/block-views';
import { showsLanguageDropdown } from '@/lib/docs-route';
import NavbarClient from './NavbarClient';

export default function NavbarBlock({
  content,
  layout,
  routeParams,
}: BlockComponentProps<Omit<Header, 'nav_links'> & HeaderView>) {
  const appearance = resolveBlockAppearance(content, layout, {
    defaultBackgroundClass: 'bg-[var(--surface)]',
  });
  return (
    <NavbarClient
      content={content}
      navClassName={[appearance.backgroundClass, appearance.textAlignClass].join(' ')}
      navItemsClassName={appearance.justifyClass}
      navStyle={appearance.style}
      searchEntries={content.search_entries}
      showLanguageDropdown={showsLanguageDropdown(routeParams)}
    />
  );
}
