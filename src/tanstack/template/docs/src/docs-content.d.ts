declare module 'virtual:docs-content' {
  export const pages: Record<string, import('./lib/docs-page-data').DocsRouteData>;
}
