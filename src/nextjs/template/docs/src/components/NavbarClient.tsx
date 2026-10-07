'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import type { ComponentProps, CSSProperties } from 'react';
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { Header } from '@/generated/cms-schemas';
import { buildDocsAssetUrl } from '@/lib/asset-url';
import type { SearchEntry } from '@/lib/search-index';
import { buildSnippet, getSearchResults } from '@/lib/search-query';
import { AppLink } from './AppLink';
import { LanguageDropdown } from './LanguageDropdown';
import { SearchBar } from './SearchBar';
import { ThemeMenu } from './ThemeMenu';

export interface NavLink {
  active?: boolean;
  href: string;
  label: string;
}

export type NavbarClientBlockProps = Omit<Header, 'nav_links'> & {
  nav_links?: NavLink[];
};

function readTrimmedString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function readHrefValue(value: unknown): string | null {
  const directValue = readTrimmedString(value);
  if (directValue) {
    return directValue;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  return readTrimmedString(record.href) ?? readTrimmedString(record.url);
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT'
  );
}

function SearchModal({
  open,
  onClose,
  entries,
}: {
  open: boolean;
  onClose: () => void;
  entries: SearchEntry[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => getSearchResults(entries, deferredQuery), [deferredQuery, entries]);

  const openResult = useCallback(
    (index: number) => {
      const result = results[index];
      if (!result) {
        return;
      }

      router.push(result.href);
      onClose();
      setQuery('');
      setActiveResultIndex(0);
    },
    [onClose, results, router]
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveResultIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (results.length === 0) {
      setActiveResultIndex(0);
      return;
    }

    if (activeResultIndex >= results.length) {
      setActiveResultIndex(results.length - 1);
    }
  }, [activeResultIndex, results]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      if (event.key === 'ArrowDown' && results.length > 0) {
        event.preventDefault();
        setActiveResultIndex((currentIndex) => (currentIndex + 1) % results.length);
      }

      if (event.key === 'ArrowUp' && results.length > 0) {
        event.preventDefault();
        setActiveResultIndex((currentIndex) =>
          currentIndex === 0 ? results.length - 1 : currentIndex - 1
        );
      }

      if (event.key === 'Enter' && results[activeResultIndex]) {
        event.preventDefault();
        openResult(activeResultIndex);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeResultIndex, onClose, open, results, openResult]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] px-4 py-4 sm:py-12">
      <button
        aria-label="Close search"
        className="absolute inset-0 bg-[var(--overlay)]"
        onClick={onClose}
        title="Close search"
        type="button"
      />
      <div className="relative mx-auto flex max-h-[min(720px,100%)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="border-[var(--border)] border-b p-4">
          <SearchBar
            autoFocus
            onChange={(value) => {
              setQuery(value);
              setActiveResultIndex(0);
            }}
            placeholder="Search docs..."
            showShortcut={false}
            value={query}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-10 text-center text-[var(--text-muted)] text-body-small-regular">
              No results for "{query}".
            </div>
          ) : (
            results.map((result, index) => (
              <button
                className={[
                  'flex w-full flex-col gap-1 rounded-xl px-3 py-3 text-left transition-colors',
                  activeResultIndex === index
                    ? 'bg-[var(--accent-soft)]'
                    : 'hover:bg-[var(--surface-muted)]',
                ].join(' ')}
                key={result.href}
                onClick={() => openResult(index)}
                onMouseEnter={() => setActiveResultIndex(index)}
                title={`View result: ${result.title}`}
                type="button"
              >
                <div
                  className={[
                    'text-xs uppercase tracking-[0.18em]',
                    activeResultIndex === index
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-muted)]',
                  ].join(' ')}
                >
                  {result.category}
                </div>
                <div
                  className={[
                    'font-semibold text-base',
                    activeResultIndex === index
                      ? 'text-[var(--accent-foreground)]'
                      : 'text-[var(--text)]',
                  ].join(' ')}
                >
                  {result.title}
                </div>
                <div
                  className={[
                    'text-sm leading-6',
                    activeResultIndex === index
                      ? 'text-[var(--accent-foreground)]'
                      : 'text-[var(--text-muted)]',
                  ].join(' ')}
                >
                  {buildSnippet(result, deferredQuery)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function appendAdminPath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/admin';
  }
  return pathname;
}

function getDefaultAdminProtocol(value: string): 'http:' | 'https:' {
  return /^(localhost|127(?:\.\d+){3})(:\d+)?(?:\/|$)/i.test(value) ? 'http:' : 'https:';
}

// Accept either a proxied `/admin` path or a CMS host/origin and ensure it lands on `/admin`.
function normalizeAdminPanelHref(href?: unknown): string {
  const value = readHrefValue(href);
  if (!value) {
    return '/admin';
  }

  if (value.startsWith('#')) {
    return value;
  }

  if (value.startsWith('/')) {
    return appendAdminPath(value);
  }

  const isProtocolRelative = value.startsWith('//');
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  const resolvedValue = hasScheme
    ? value
    : isProtocolRelative
      ? `https:${value}`
      : `${getDefaultAdminProtocol(value)}//${value}`;

  try {
    const url = new URL(resolvedValue);
    url.pathname = appendAdminPath(url.pathname);

    if (isProtocolRelative) {
      return `//${url.host}${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    return value;
  }
}

function capitalizeLabel(value: unknown): string {
  const label = readTrimmedString(value) ?? 'Admin Panel';

  return label
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Nav link hrefs are free-text CMS content, so an editor can author an absolute
 * or protocol-relative URL. Client routers should not prefetch or navigate
 * navigate those, so anything that isn't an in-app path falls back to `<a>`.
 */
function isInAppHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

function SectionLink({
  href,
  children,
  ...props
}: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  if (!isInAppHref(href)) {
    const isExternal = /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
    return (
      <a
        href={href}
        {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <AppLink href={href} {...props}>
      {children}
    </AppLink>
  );
}

const SECTION_LINK_CLASS =
  'inline-flex max-w-40 shrink-0 items-center truncate px-3.5 py-2.5 text-body-small-regular no-underline transition-colors -mb-px sm:max-w-56';

function getSectionLinkClass(isActive: boolean): string {
  return [
    SECTION_LINK_CLASS,
    isActive
      ? 'border-b-2 border-[var(--accent)] font-semibold text-[var(--text)]'
      : 'border-b-2 border-transparent font-normal text-[var(--text-muted)] hover:text-[var(--text)]',
  ].join(' ');
}

function SectionNavigation({
  links,
  activeLink,
  onActiveLinkChange,
}: {
  links: NavLink[];
  activeLink?: string;
  onActiveLinkChange: (label: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(links.length);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const containerWidth = container.clientWidth;
    if (containerWidth <= 0) {
      return;
    }

    const itemWidths = links.map((_, index) => itemRefs.current[index]?.offsetWidth ?? 0);
    const moreWidth = moreRef.current?.offsetWidth ?? 88;
    const gap = 8;

    let nextVisibleCount = 0;
    let usedWidth = 0;

    for (let index = 0; index < itemWidths.length; index++) {
      const width = itemWidths[index] ?? 0;
      const nextWidth = usedWidth + width + (nextVisibleCount > 0 ? gap : 0);
      const reserveMoreWidth = index < itemWidths.length - 1 ? moreWidth + gap : 0;

      if (nextWidth + reserveMoreWidth > containerWidth) {
        break;
      }

      usedWidth = nextWidth;
      nextVisibleCount += 1;
    }

    setVisibleCount(Math.max(1, nextVisibleCount));
  }, [links]);

  useEffect(() => {
    measure();

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const menu = menuRef.current;
      if (!(menu && event.target instanceof Node)) {
        return;
      }
      if (!menu.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMoreOpen]);

  const activeIndex = links.findIndex((link) => link.label === activeLink);
  const visibleIndexes = new Set(links.slice(0, visibleCount).map((_, index) => index));

  if (activeIndex >= visibleCount && activeIndex >= 0) {
    visibleIndexes.delete(Math.max(0, visibleCount - 1));
    visibleIndexes.add(activeIndex);
  }

  const visibleLinks = links.filter((_, index) => visibleIndexes.has(index));
  const overflowLinks = links.filter((_, index) => !visibleIndexes.has(index));

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <div className="pointer-events-none absolute top-0 left-0 -z-10 flex h-0 gap-2 overflow-hidden opacity-0">
        {links.map((link, index) => (
          <span
            className={getSectionLinkClass(link.label === activeLink)}
            key={link.label}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
          >
            {link.label}
          </span>
        ))}
        <button
          aria-hidden={true}
          className="inline-flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 font-medium text-[var(--text-muted)] text-body-small-regular"
          ref={moreRef}
          tabIndex={-1}
          type="button"
        >
          More
          <ChevronDownIcon aria-hidden={true} className="size-3.5" />
        </button>
      </div>

      <div className="flex min-w-0 items-end gap-2 overflow-visible">
        {visibleLinks.map((link) => {
          const isActive = activeLink === link.label;
          return (
            <SectionLink
              className={getSectionLinkClass(isActive)}
              href={link.href}
              key={link.label}
              onClick={() => {
                onActiveLinkChange(link.label);
                setIsMoreOpen(false);
              }}
              title={link.label}
            >
              {link.label}
            </SectionLink>
          );
        })}

        {overflowLinks.length > 0 ? (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              className={[
                'inline-flex cursor-pointer items-center gap-1.5 px-3.5 py-2.5 font-medium text-body-small-regular',
                'border-transparent border-b-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]',
              ].join(' ')}
              onClick={() => setIsMoreOpen((open) => !open)}
              title="More sections"
              type="button"
            >
              More
              <ChevronDownIcon
                aria-hidden={true}
                className={['size-3.5 transition-transform', isMoreOpen ? 'rotate-180' : ''].join(
                  ' '
                )}
              />
            </button>

            {isMoreOpen ? (
              <div
                className="absolute right-0 z-[70] mt-2 w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-2xl shadow-black/30"
                role="menu"
              >
                {overflowLinks.map((link) => {
                  const isActive = activeLink === link.label;
                  return (
                    <SectionLink
                      className={[
                        'block truncate rounded-md px-3 py-2 text-sm no-underline transition-colors',
                        isActive
                          ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent-foreground)]'
                          : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
                      ].join(' ')}
                      href={link.href}
                      key={link.label}
                      onClick={() => {
                        onActiveLinkChange(link.label);
                        setIsMoreOpen(false);
                      }}
                      role="menuitem"
                      title={link.label}
                    >
                      {link.label}
                    </SectionLink>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function NavbarClient({
  content,
  navClassName,
  navStyle,
  navItemsClassName,
  searchEntries,
  showLanguageDropdown = false,
}: {
  content: NavbarClientBlockProps;
  navClassName?: string;
  navStyle?: CSSProperties;
  navItemsClassName?: string;
  searchEntries: SearchEntry[];
  showLanguageDropdown?: boolean;
}) {
  const {
    icon,
    logo_text = 'Median',
    admin_panel_label = 'Admin Panel',
    admin_panel_href = '/admin',
    search_placeholder = 'Search...',
    nav_links = [],
  } = content;

  const resolvedAdminPanelHref = normalizeAdminPanelHref(admin_panel_href);
  const adminPanelLabel = capitalizeLabel(admin_panel_label);
  const iconAsset = icon as
    | { _asset?: { url?: string; mime_type?: string }; alt?: string }
    | undefined;
  const iconUrl = buildDocsAssetUrl(iconAsset?._asset?.url, {
    mimeType: iconAsset?._asset?.mime_type,
  });
  const iconAlt = iconAsset?.alt ?? 'logo';

  // The link for the section this page is in (none when it is in none), and a
  // clicked link until the next page's header says otherwise.
  const currentLink = nav_links.find((l) => l.active)?.label;
  const [activeLink, setActiveLink] = useState(currentLink);
  const [shownFor, setShownFor] = useState(currentLink);
  if (shownFor !== currentLink) {
    setShownFor(currentLink);
    setActiveLink(currentLink);
  }
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = navRef.current;
    if (!element) {
      return;
    }

    // Keep the shared sticky offset in sync with the rendered nav height.
    const updateHeight = () => {
      document.documentElement.style.setProperty('--docs-nav-height', `${element.offsetHeight}px`);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <nav
        className={[
          'select-none border-[var(--border)] border-b font-sans text-[var(--text)]',
          navClassName || 'bg-[var(--surface)]',
        ].join(' ')}
        data-cms-live-background=""
        data-cms-live-default-background="var(--surface)"
        ref={navRef}
        style={navStyle}
      >
        <div
          className={[
            'mx-auto flex min-h-14 w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6',
            navItemsClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          data-cms-live-alignment=""
          data-cms-live-preserve-align-items=""
        >
          <div className="flex min-w-0 shrink items-center gap-2">
            <AppLink className="flex min-w-0 shrink items-center gap-2 no-underline" href="/">
              {iconUrl && (
                <img
                  alt={iconAlt}
                  className="size-[18px] object-contain"
                  height={18}
                  src={iconUrl}
                  width={18}
                />
              )}
              <span className="truncate font-semibold text-[15px] text-[var(--text)] tracking-tight">
                {logo_text}
              </span>
            </AppLink>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <LanguageDropdown showLanguageDropdown={showLanguageDropdown} />
            </div>
          </div>

          <div className="order-3 w-full md:order-none md:flex md:flex-1 md:justify-center">
            <SearchBar
              className="mx-auto max-w-[22rem] sm:max-w-[26rem] md:max-w-[480px]"
              onClick={() => setIsSearchOpen(true)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={search_placeholder}
              readOnly
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
            <a
              className={[
                'inline-flex cursor-pointer items-center gap-2 rounded-full',
                'px-3 py-1.5 font-medium text-sm',
                'text-[var(--text)] transition-colors',
                'hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
              ].join(' ')}
              href={resolvedAdminPanelHref}
              title={`Open ${adminPanelLabel}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/70" />
              {adminPanelLabel}
            </a>
            <div className="hidden sm:block">
              <ThemeMenu />
            </div>
          </div>
        </div>

        {nav_links.length > 0 && (
          <div className="border-[var(--border)] border-t">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6">
              <SectionNavigation
                activeLink={activeLink}
                links={nav_links}
                onActiveLinkChange={setActiveLink}
              />
            </div>
          </div>
        )}
      </nav>

      <SearchModal
        entries={searchEntries}
        onClose={() => setIsSearchOpen(false)}
        open={isSearchOpen}
      />
    </>
  );
}
