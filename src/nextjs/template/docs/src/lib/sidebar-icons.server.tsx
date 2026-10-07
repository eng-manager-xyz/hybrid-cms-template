import * as outline from '@heroicons/react/24/outline';
import * as solid from '@heroicons/react/24/solid';
import type { ElementType, ReactElement, SVGProps } from 'react';

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

const ICON_SETS: Record<string, Record<string, unknown>> = { outline, solid };

/** A Heroicon element for a stored icon value, or null when it does not exist. */
export async function renderSidebarIcon(value: string | undefined): Promise<ReactElement | null> {
  if (!value) return null;
  const [variant, name] = normalizeSidebarIconValue(value).split(':') as [string, string];
  const Component = ICON_SETS[variant]?.[`${name}Icon`] as Icon | undefined;
  return Component ? (
    <Component aria-hidden={true} className="size-5 shrink-0 text-[var(--text-soft)]" />
  ) : null;
}
