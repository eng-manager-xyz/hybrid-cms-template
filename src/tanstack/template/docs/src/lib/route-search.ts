export type DocsRouteSearch = Record<string, string | string[] | boolean | undefined>;

/** Keep only query values that can safely cross the server-function boundary. */
export function normalizeDocsRouteSearch(search: Record<string, unknown>): DocsRouteSearch {
  const normalized: DocsRouteSearch = {};
  for (const [key, value] of Object.entries(search)) {
    if (typeof value === 'string' || typeof value === 'boolean') {
      normalized[key] = value;
    } else if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      normalized[key] = value;
    }
  }
  return normalized;
}
