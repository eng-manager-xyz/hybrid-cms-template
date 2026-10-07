import type { ElementType, SVGProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

type Icon = ElementType<SVGProps<SVGSVGElement>>;

function toPascalIconName(value: string): string {
  const iconName = value.trim().replace(/Icon$/i, '');
  const words = iconName.match(/[A-Z]?[a-z0-9]+|[A-Z]+(?![a-z])/g) ?? [];
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

/** `variant:Name` for a stored icon value; unknown variants fall back to outline. */
export function normalizeSidebarIconValue(value: string): string {
  const [variant, name] = value.trim().split(':', 2);
  const normalizedVariant = variant === 'solid' ? 'solid' : 'outline';
  return `${normalizedVariant}:${toPascalIconName(name ?? variant ?? '')}`;
}

const rendered = new Map<string, Promise<string | null>>();

/** A Heroicon rendered to SVG markup once per value, or null when it does not exist. */
export function renderSidebarIconSvg(value: string | undefined): Promise<string | null> {
  if (!value) return Promise.resolve(null);
  const key = normalizeSidebarIconValue(value);
  const [variant, name] = key.split(':') as [string, string];
  if (!name) return Promise.resolve(null);
  let svg = rendered.get(key);
  if (!svg) {
    svg = import(`@heroicons/react/24/${variant}/${name}Icon.js`)
      .then(({ default: Component }: { default?: Icon }) =>
        Component
          ? renderToStaticMarkup(
              <Component aria-hidden={true} className="size-5 shrink-0 text-[var(--text-soft)]" />
            )
          : null
      )
      .catch(() => null);
    rendered.set(key, svg);
  }
  return svg;
}
