'use client';

import {
  ChevronDownIcon,
  ClipboardDocumentIcon,
  CodeBracketIcon,
  DocumentTextIcon,
} from '@heroicons/react/16/solid';
import { useEffect, useRef, useState } from 'react';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

interface CopyContentControlsProps {
  contentElementId: string;
  markdown: string;
}

export function CopyContentControls({
  markdown,
  contentElementId,
}: Readonly<CopyContentControlsProps>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [state, setState] = useState<CopyState>('idle');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const scheduleReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setState('idle');
      resetTimerRef.current = null;
    }, 1600);
  };

  const copyMarkdown = async () => {
    try {
      setState('copying');
      await navigator.clipboard.writeText(markdown);
      setState('copied');
      scheduleReset();
    } catch {
      setState('error');
      scheduleReset();
    }
  };

  const copyRawText = async () => {
    try {
      const contentNode = document.getElementById(contentElementId);
      const rawText = (contentNode?.innerText ?? contentNode?.textContent ?? '').trim();
      if (!rawText) {
        setState('error');
        scheduleReset();
        return;
      }
      setState('copying');
      await navigator.clipboard.writeText(rawText);
      setState('copied');
      scheduleReset();
    } catch {
      setState('error');
      scheduleReset();
    }
  };

  const copyByMode = async (copyMode: 'markdown' | 'raw') => {
    setMenuOpen(false);
    if (copyMode === 'markdown') {
      await copyMarkdown();
      return;
    }
    await copyRawText();
  };

  const feedbackText = state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : null;
  const feedbackClass = state === 'copied' ? 'text-[var(--accent)]' : 'text-[var(--danger)]';
  const showFeedback = feedbackText !== null;
  const copyOptions = [
    {
      description: 'Copy page as Markdown',
      Icon: CodeBracketIcon,
      key: 'markdown',
      label: 'Markdown',
      onSelect: () => copyByMode('markdown'),
    },
    {
      description: 'Copy page as Plain Text',
      Icon: DocumentTextIcon,
      key: 'raw',
      label: 'Plain Text',
      onSelect: () => copyByMode('raw'),
    },
  ] as const;

  return (
    <div className="flex items-center justify-end">
      <div className="relative inline-flex flex-col items-end gap-1.5" ref={containerRef}>
        <span
          className={[
            'pointer-events-none absolute top-1/2 left-full ml-2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)]/95 px-2 py-1 text-xs transition-all duration-200 ease-in-out',
            showFeedback
              ? `translate-x-0 -translate-y-1/2 opacity-100 ${feedbackClass}`
              : 'translate-x-1 -translate-y-1/2 opacity-0',
          ].join(' ')}
        >
          {feedbackText ?? ''}
        </span>

        <div className="inline-flex overflow-hidden rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-foreground)] text-xs transition-colors hover:opacity-90">
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 transition-colors hover:text-[var(--accent)]"
            onClick={() => {
              setMenuOpen(false);
              void copyMarkdown();
            }}
            title="Copy page content to clipboard"
            type="button"
          >
            <ClipboardDocumentIcon aria-hidden="true" className="size-3.5" />
            <span>{state === 'copying' ? 'Copying...' : 'Copy page'}</span>
          </button>
          <button
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open copy options"
            className="inline-flex cursor-pointer items-center border-[var(--accent)] border-l px-2 transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--accent)]"
            onClick={() => setMenuOpen((open) => !open)}
            title="More copy options"
            type="button"
          >
            <ChevronDownIcon
              aria-hidden="true"
              className={`size-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {menuOpen ? (
          <div
            aria-label="Copy options"
            className="absolute top-full right-0 z-20 mt-1 w-[18rem] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-lg"
            role="menu"
            style={{ boxShadow: '0 18px 40px var(--shadow-color)' }}
          >
            {copyOptions.map(({ key, label, description, Icon, onSelect }) => (
              <button
                className="flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-muted)]"
                key={key}
                onClick={() => {
                  void onSelect();
                }}
                role="menuitem"
                title={description}
                type="button"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--accent)]">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-[var(--text)] text-xs">{label}</span>
                  <span className="mt-0.5 block text-[var(--text-muted)] text-xs leading-4">
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
