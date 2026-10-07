export function NotFoundPage() {
  return (
    <main
      className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6 py-12"
      data-docs-status=""
    >
      <p className="font-semibold text-[var(--accent)] text-sm uppercase tracking-widest">404</p>
      <h1 className="font-bold text-3xl text-[var(--text)]">Page not found</h1>
      <p className="text-[var(--text-muted)] leading-relaxed">
        Either create a new page in the admin panel, or check that you’re at the correct URL.
      </p>
      <a className="text-[var(--accent)] underline underline-offset-4" href="/">
        Return to the documentation
      </a>
    </main>
  );
}
