/**
 * Where a CMS `url` field points. The field holds a link `{ label, href }`;
 * content saved before links had labels holds the bare URL string.
 */
export function linkHref(value: unknown): string | undefined {
  const href =
    typeof value === 'object' && value !== null ? (value as { href?: unknown }).href : value;
  return typeof href === 'string' && href ? href : undefined;
}
