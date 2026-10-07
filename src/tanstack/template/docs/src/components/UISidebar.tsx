import type { BlockComponentProps } from 'cms-renderer';
import { resolveBlockAppearance } from '@/lib/block-layout';
import type { SidebarView } from '@/lib/block-views';
import UISidebarClient from './UISidebarClient';

export default function UISidebar({ content, layout }: BlockComponentProps<SidebarView>) {
  const appearance = resolveBlockAppearance(content, layout);
  console.log(content);
  return (
    <aside
      className={[
        'w-full font-sans lg:w-[260px]',
        appearance.backgroundClass,
        appearance.textAlignClass,
      ].join(' ')}
      data-cms-live-alignment=""
      data-cms-live-background=""
      data-cms-live-default-background="var(--background)"
      style={appearance.style}
    >
      <UISidebarClient sections={content.sections} />
    </aside>
  );
}
