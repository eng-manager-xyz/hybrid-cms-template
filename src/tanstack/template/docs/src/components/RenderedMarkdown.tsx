import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PreviewImage {
  alt: string;
  src: string;
  title?: string;
}

export function RenderedMarkdown({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [preview, setPreview] = useState<PreviewImage | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const copyButton = target?.closest<HTMLElement>('[data-docs-copy-code]');
      if (copyButton) {
        const code = copyButton.dataset.docsCopyCode ?? '';
        void navigator.clipboard.writeText(code).then(
          () => {
            copyButton.title = 'Copied';
            copyButton.setAttribute('aria-label', 'Copied');
            window.setTimeout(() => {
              copyButton.title = 'Copy code';
              copyButton.setAttribute('aria-label', 'Copy code');
            }, 1400);
          },
          () => undefined
        );
        return;
      }

      const imageButton = target?.closest<HTMLElement>('[data-docs-image]');
      const src = imageButton?.dataset.docsImage;
      if (src) {
        setPreview({
          alt: imageButton.dataset.docsImageAlt ?? '',
          src,
          title: imageButton.dataset.docsImageTitle,
        });
      }
    };

    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!preview) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreview(null);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [preview]);

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: generated at build time by the sanitized CMS markdown renderer */}
      <div dangerouslySetInnerHTML={{ __html: html }} ref={containerRef} />
      {preview
        ? createPortal(
            <div className="fixed inset-0 z-[90] p-4">
              <button
                aria-label="Close image preview"
                className="absolute inset-0 bg-black/80"
                onClick={() => setPreview(null)}
                type="button"
              />
              <div className="pointer-events-none relative flex h-full items-center justify-center">
                <img
                  alt={preview.alt}
                  className="pointer-events-auto max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                  src={preview.src}
                  title={preview.title}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
