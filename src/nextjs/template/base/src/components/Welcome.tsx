/** Shown at `/` until the CMS has a published home page. */
export function Welcome({ configured }: { configured: boolean }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 font-sans">
      <h1 className="text-3xl font-bold">{'{{PROJECT_NAME}}'}</h1>
      {configured ? (
        <p className="text-gray-600">
          Connected to Median. Publish a page at <code>/</code> in the CMS, register its UI
          elements in <code>src/lib/registry.ts</code>, then rebuild to see it here.
        </p>
      ) : (
        <ol className="list-decimal space-y-2 pl-5 text-gray-600">
          <li>
            Copy <code>.env.example</code> to <code>.env</code> and set{' '}
            <code>MEDIAN_WEBSITE_ID</code>, <code>MEDIAN_API_KEY</code> and{' '}
            <code>DATASET_ENDPOINT</code> (CMS → Settings).
          </li>
          <li>
            Map your CMS UI elements to components in <code>src/lib/registry.ts</code>.
          </li>
          <li>
            Restart <code>bun dev</code>. Pages you publish in Median appear at their URLs.
          </li>
        </ol>
      )}
    </main>
  );
}
