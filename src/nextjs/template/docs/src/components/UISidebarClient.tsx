'use client';

import { Bars3Icon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import type { SidebarSectionView } from '@/lib/block-views';
import { AppLink } from './AppLink';
import { ThemeMenu } from './ThemeMenu';

const API_BADGE_CLASSES: Record<string, string> = {
  get: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  post: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  options: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  patch: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
};

function ApiMethodBadge({ apiIcon }: { apiIcon: string }) {
  return (
    <span
      className={[
        'inline-flex h-4 min-w-7 shrink-0 items-center justify-center rounded px-1.5 font-bold text-[9px] uppercase leading-none',
        API_BADGE_CLASSES[apiIcon] ?? 'bg-[var(--surface-strong)] text-[var(--text-muted)]',
      ].join(' ')}
    >
      {apiIcon}
    </span>
  );
}

function MobileSidebarButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Open docs navigation"
      className="flex w-full items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 font-medium text-[var(--text)] text-sm"
      onClick={onClick}
      title="Open docs navigation"
      type="button"
    >
      <span className="flex items-center gap-3">
        <Bars3Icon aria-hidden={true} className="size-4 text-[var(--text-muted)]" />
        <span>Docs</span>
      </span>
      <ChevronRightIcon aria-hidden={true} className="size-4 text-[var(--text-muted)]" />
    </button>
  );
}

const sectionKey = (section: SidebarSectionView) => section.href ?? section.title;

/**
 * Which sections are open. The section of the current page opens itself (also
 * after client navigation); the others keep whatever the reader toggled.
 */
function useOpenSections(sections: SidebarSectionView[]) {
  const activeKeys = sections.filter((section) => section.active).map(sectionKey);
  const [open, setOpen] = useState(() => new Set(activeKeys));
  const activeKey = activeKeys.join('\n');
  useEffect(() => {
    if (!activeKey) return;
    setOpen((current) => {
      const keys = activeKey.split('\n').filter((key) => !current.has(key));
      return keys.length ? new Set([...current, ...keys]) : current;
    });
  }, [activeKey]);
  const toggle = (key: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  return { open, toggle };
}

function SidebarSectionList({
  sections,
  linkPaddingClassName,
  onLinkClick,
}: {
  sections: SidebarSectionView[];
  linkPaddingClassName: string;
  onLinkClick?: () => void;
}) {
  const { open, toggle } = useOpenSections(sections);
  return (
    <>
      {sections.map((section) => {
        const key = sectionKey(section);
        const expanded = open.has(key);
        const listId = `sidebar-section-${key.replace(/[^a-z0-9]+/gi, '-')}`;
        const titleClassName = [
          'min-w-0 flex-1 truncate rounded-md px-2 py-1.5 font-semibold text-xs uppercase tracking-wider no-underline transition-colors',
          section.current
            ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
            : section.active
              ? 'text-[var(--text)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
        ].join(' ');
        return (
          <div className="mb-2" key={key}>
            <div className="flex items-center gap-1">
              {section.href ? (
                <AppLink
                  aria-current={section.current ? 'page' : undefined}
                  className={titleClassName}
                  href={section.href}
                  onClick={onLinkClick}
                >
                  {section.title}
                </AppLink>
              ) : (
                <button
                  className={`${titleClassName} cursor-pointer text-left`}
                  onClick={() => toggle(key)}
                  type="button"
                >
                  {section.title}
                </button>
              )}
              <button
                aria-controls={listId}
                aria-expanded={expanded}
                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${section.title}`}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                onClick={() => toggle(key)}
                title={`${expanded ? 'Collapse' : 'Expand'} ${section.title}`}
                type="button"
              >
                <ChevronRightIcon
                  aria-hidden={true}
                  className={`size-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
            {expanded ? (
              <div className="mt-1 mb-3 ml-2 border-[var(--border)] border-l pl-2" id={listId}>
                {section.links.map((item) => (
                  <AppLink
                    aria-current={item.active ? 'page' : undefined}
                    className={[
                      'flex items-center gap-2 rounded-md px-2 text-sm no-underline transition-colors',
                      linkPaddingClassName,
                      item.active
                        ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
                    ].join(' ')}
                    href={item.href}
                    key={item.href}
                    onClick={onLinkClick}
                  >
                    {item.apiBadge ? <ApiMethodBadge apiIcon={item.apiBadge} /> : null}
                    {item.icon ? <span aria-hidden="true" className="contents">{item.icon}</span> : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </AppLink>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

function MobileSidebarDrawer({
  sections,
  open,
  onClose,
}: {
  sections: SidebarSectionView[];
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[75] lg:hidden">
      <button
        aria-label="Close docs navigation"
        className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div className="relative ml-auto flex h-full w-full max-w-[20rem] flex-col border-[var(--border)] border-l bg-[var(--surface)]">
        <div className="flex items-center justify-between border-[var(--border)] border-b px-4 py-4">
          <div className="font-semibold text-[var(--text-muted)] text-sm uppercase tracking-[0.18em]">
            Docs
          </div>

          <button
            aria-label="Close docs navigation"
            className="mr-2 cursor-pointer rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            onClick={onClose}
            title="Close docs navigation"
            type="button"
          >
            <XMarkIcon aria-hidden={true} className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <SidebarSectionList
            linkPaddingClassName="py-2"
            onLinkClick={onClose}
            sections={sections}
          />
        </div>

        <div className="mt-auto border-[var(--border)] border-t px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-[var(--text-muted)] text-sm">Appearance</span>
            <ThemeMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UISidebarClient({ sections }: { sections: SidebarSectionView[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="px-4 py-4 lg:hidden">
        <MobileSidebarButton onClick={() => setIsOpen(true)} />
      </div>

      <div className="hidden px-4 py-6 lg:block">
        <SidebarSectionList linkPaddingClassName="py-1.5" sections={sections} />
      </div>

      <MobileSidebarDrawer onClose={() => setIsOpen(false)} open={isOpen} sections={sections} />
    </>
  );
}
