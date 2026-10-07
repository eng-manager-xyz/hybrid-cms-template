import type { BlockComponentRegistry } from 'cms-renderer';

import NavbarBlock from '@/components/NavbarBlock';
import UIContent from '@/components/UIContent';
import UIFooter from '@/components/UIFooter';
import UISidebar from '@/components/UISidebar';

/** CMS UI element name → the component that renders it. Add your own blocks here. */
export const docsBlockRegistry: Partial<BlockComponentRegistry> = {
  // biome-ignore lint/suspicious/noExplicitAny: block props are CMS-defined at runtime
  header: NavbarBlock as any,
  // biome-ignore lint/suspicious/noExplicitAny: block props are CMS-defined at runtime
  content: UIContent as any,
  // biome-ignore lint/suspicious/noExplicitAny: block props are CMS-defined at runtime
  footer: UIFooter as any,
  // biome-ignore lint/suspicious/noExplicitAny: block props are CMS-defined at runtime
  sidebar: UISidebar as any,
};
