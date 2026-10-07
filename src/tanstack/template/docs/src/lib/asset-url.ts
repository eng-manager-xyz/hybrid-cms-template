/** Image fields arrive from Median with their URL resolved; this keeps an empty one empty. */
export function buildDocsAssetUrl(url?: string, _options?: { mimeType?: string }): string {
  return url ?? '';
}
