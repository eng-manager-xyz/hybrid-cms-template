import type { BlockLayout } from 'cms-renderer';
import {
  isLayoutDimensionConfigured,
  normalizeAlignment,
  resolveBackgroundColor,
} from 'cms-renderer';
import type { CSSProperties } from 'react';

export interface ResolvedBlockAppearance {
  alignment: 'left' | 'center' | 'right';
  backgroundClass: string;
  hasConfiguredAlignment: boolean;
  hasConfiguredBackground: boolean;
  itemsClass: string;
  justifyClass: string;
  /** Container placement (margins) derived from alignment — mirrors the overlay's `data-cms-live-placement` logic. */
  placementClass: string;
  style?: CSSProperties;
  textAlignClass: string;
}

interface ResolveBlockAppearanceOptions {
  defaultBackgroundClass?: string;
}

function normalizeBackground(
  value: unknown,
  defaultBackgroundClass: string
): { className: string; configured: boolean; style?: CSSProperties } {
  const color = resolveBackgroundColor(value);
  if (color === null) {
    return { className: defaultBackgroundClass, configured: false };
  }

  return { className: '', configured: true, style: { backgroundColor: color } };
}

export function resolveBlockAppearance(
  content: object,
  layout?: BlockLayout | null,
  options: ResolveBlockAppearanceOptions = {}
): ResolvedBlockAppearance {
  const layoutContent = content as { alignment?: unknown; layout?: unknown; background?: unknown };
  const defaultBackgroundClass = options.defaultBackgroundClass ?? 'bg-[var(--background)]';
  const shouldUseLayoutAlignment = isLayoutDimensionConfigured(layout, 'alignment');
  const shouldUseLayoutBackground = isLayoutDimensionConfigured(layout, 'background');
  const configuredAlignment =
    normalizeAlignment(layoutContent.layout) ??
    normalizeAlignment(layoutContent.alignment) ??
    (shouldUseLayoutAlignment ? normalizeAlignment(layout?.alignment) : null);
  const alignment = configuredAlignment ?? 'left';
  const background = normalizeBackground(
    layoutContent.background ?? (shouldUseLayoutBackground ? layout?.background : undefined),
    defaultBackgroundClass
  );

  return {
    alignment,
    backgroundClass: background.className,
    hasConfiguredAlignment: configuredAlignment !== null,
    hasConfiguredBackground: background.configured,
    itemsClass:
      alignment === 'center' ? 'items-center' : alignment === 'right' ? 'items-end' : 'items-start',
    justifyClass:
      alignment === 'center'
        ? 'justify-center'
        : alignment === 'right'
          ? 'justify-end'
          : 'justify-start',
    placementClass:
      alignment === 'center'
        ? 'mx-auto'
        : alignment === 'right'
          ? 'ml-auto mr-0'
          : 'lg:mx-0 lg:pl-4',
    style: background.style,
    textAlignClass:
      alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left',
  };
}
