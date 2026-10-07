import { ContentSkeleton } from '@/lib/content-skeleton';

const sidebarItems = ['a', 'b', 'c', 'd', 'e', 'f'];

export function DocsLoading() {
  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="border-[var(--border)] border-b bg-[var(--surface)]">
        <div className="mx-auto flex min-h-14 w-full max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="h-5 w-5 rounded bg-[var(--surface-strong)]" />
          <div className="h-4 w-24 rounded-full bg-[var(--surface-strong)]" />
          <div className="hidden flex-1 justify-center md:flex">
            <div className="h-9 w-full max-w-[480px] rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]" />
          </div>
          <div className="ml-auto h-8 w-8 rounded-full bg-[var(--surface-strong)]" />
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <aside className="border-[var(--border)] border-b bg-[var(--surface)] lg:border-r lg:border-b-0">
          <div className="space-y-2 px-4 py-6">
            {sidebarItems.map((item) => (
              <div className="h-4 w-full rounded-md bg-[var(--surface-muted)]" key={item} />
            ))}
          </div>
        </aside>
        <ContentSkeleton />
      </div>
    </section>
  );
}
