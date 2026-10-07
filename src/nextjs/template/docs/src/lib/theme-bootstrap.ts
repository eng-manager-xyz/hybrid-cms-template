/** Shared by the bootstrap script (server) and the theme provider (client). */
export const STORAGE_KEY = 'cms-theme';
export const MEDIA_QUERY = '(prefers-color-scheme: dark)';

/** Runs before paint so the saved color theme never flashes. */
export const THEME_BOOTSTRAP_SCRIPT = `
(() => {
  const storageKey = '${STORAGE_KEY}';
  const mediaQuery = '${MEDIA_QUERY}';

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme =
      storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
        ? storedTheme
        : 'system';
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia(mediaQuery).matches
          ? 'dark'
          : 'light'
        : theme;

    if (document.documentElement.getAttribute('data-theme') !== resolvedTheme) {
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    }
  } catch {
    const fallbackTheme = window.matchMedia(mediaQuery).matches ? 'dark' : 'light';
    if (document.documentElement.getAttribute('data-theme') !== fallbackTheme) {
      document.documentElement.setAttribute('data-theme', fallbackTheme);
    }
  }
})();
`;
