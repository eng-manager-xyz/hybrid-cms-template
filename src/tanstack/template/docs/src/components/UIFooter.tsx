import type { BlockComponentProps } from 'cms-renderer';
import type { ReactNode } from 'react';
import type { Uifooter } from '@/generated/cms-schemas';
import { buildDocsAssetUrl } from '@/lib/asset-url';
import { resolveBlockAppearance } from '@/lib/block-layout';
import type { FooterView, SocialNetwork } from '@/lib/block-views';
import { showsLanguageDropdown } from '@/lib/docs-route';
import { linkHref } from '@/lib/link-href';
import { GithubIcon, LinkedInIcon, XIcon } from './icons';
import { LanguageDropdown } from './LanguageDropdown';
import { ThemeMenu } from './ThemeMenu';

const SOCIAL: Record<SocialNetwork, { icon: ReactNode; label: string }> = {
  x: { icon: <XIcon />, label: 'X' },
  github: { icon: <GithubIcon />, label: 'GitHub' },
  linkedin: { icon: <LinkedInIcon />, label: 'LinkedIn' },
};

export default function UIFooter({
  content,
  layout,
  routeParams,
}: BlockComponentProps<Uifooter & FooterView>) {
  const showLanguageDropdown = showsLanguageDropdown(routeParams);
  const appearance = resolveBlockAppearance(content, layout);
  const footerAlignmentClasses = appearance.hasConfiguredAlignment
    ? [appearance.itemsClass, appearance.justifyClass, appearance.textAlignClass]
    : ['items-center', 'text-center', 'sm:items-center', 'sm:justify-between', 'sm:text-left'];
  const { powered_by, social_links } = content;
  const poweredByUrl = linkHref(content.poweredby_url);
  const statusPageUrl = linkHref(content.status_page_url);

  const poweredByAsset = powered_by as
    | { _asset?: { url?: string; mime_type?: string }; alt?: string }
    | undefined;

  const logoAlt = powered_by?.alt;

  const logoUrl = buildDocsAssetUrl(poweredByAsset?._asset?.url, {
    mimeType: poweredByAsset?._asset?.mime_type,
  });

  return (
    <footer
      className={[
        'border-[var(--border)] border-t px-4 pt-8 pb-16 font-sans text-[var(--text)] sm:px-6 lg:px-12',
        appearance.backgroundClass,
        appearance.hasConfiguredAlignment ? appearance.textAlignClass : '',
      ].join(' ')}
      data-cms-live-background=""
      data-cms-live-default-background="var(--background)"
      style={appearance.style}
    >
      <div
        className={[
          'mx-auto flex w-full max-w-[48rem] flex-col gap-6 sm:flex-row',
          appearance.placementClass,
          ...footerAlignmentClasses,
        ].join(' ')}
        data-cms-live-alignment=""
        data-cms-live-placement=""
      >
        <div className="flex items-center gap-5">
          {social_links.map(({ network, href }) => (
            <a
              aria-label={SOCIAL[network].label}
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              href={href}
              key={network}
              rel="noopener noreferrer"
              target="_blank"
              title={`Visit our ${SOCIAL[network].label} profile`}
            >
              {SOCIAL[network].icon}
            </a>
          ))}

          {statusPageUrl && (
            <a
              className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--text)]"
              href={statusPageUrl}
              rel="noopener noreferrer"
              target="_blank"
              title="View status page"
            >
              <span aria-hidden="true" className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All Systems Operational
            </a>
          )}
        </div>

        <a
          className="flex items-center gap-2 no-underline opacity-60 transition-opacity hover:opacity-100 sm:ml-auto"
          href={poweredByUrl ?? '#'}
          rel="noopener noreferrer"
          target="_blank"
          title="Visit our powered by profile"
        >
          <span className="text-[11px] text-[var(--text-soft)] uppercase tracking-[0.18em]">
            Powered By
          </span>

          {logoUrl ? (
            <img
              alt={logoAlt ?? ''}
              className="h-auto w-auto object-contain"
              height={20}
              src={logoUrl}
              width={95}
            />
          ) : (
            <span className="text-[var(--text-soft)] text-xs">{logoAlt}</span>
          )}
        </a>

        <div className="flex items-center justify-center gap-4 sm:hidden">
          <LanguageDropdown showLanguageDropdown={showLanguageDropdown} />
          <ThemeMenu />
        </div>
      </div>
    </footer>
  );
}
