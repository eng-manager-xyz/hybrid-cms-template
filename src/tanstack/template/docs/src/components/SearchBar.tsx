'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useEffect, useId, useRef } from 'react';

interface SearchBarProps {
  autoFocus?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onFocus?: () => void;
  placeholder: string;
  readOnly?: boolean;
  showShortcut?: boolean;
  value?: string;
}

export function SearchBar({
  placeholder,
  className = '',
  value,
  onChange,
  onFocus,
  onClick,
  readOnly = false,
  autoFocus = false,
  showShortcut = true,
}: SearchBarProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div
      className={[
        'flex h-8 w-full items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 text-sm',
        'transition-colors focus-within:border-[var(--accent)]',
        'md:h-9 md:max-w-[480px]',
        className,
      ].join(' ')}
    >
      <label className="flex shrink-0 text-[var(--text-muted)]" htmlFor={inputId}>
        <MagnifyingGlassIcon className="size-3.5 shrink-0" />
      </label>
      <input
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] md:text-sm"
        id={inputId}
        onChange={(event) => onChange?.(event.target.value)}
        onClick={() => onClick?.()}
        onFocus={() => onFocus?.()}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={inputRef}
        type="search"
        value={value}
      />
      {showShortcut ? (
        <kbd className="hidden bg-transparent p-0 font-sans text-[var(--text-soft)] text-xs md:block">
          ⌘K
        </kbd>
      ) : null}
    </div>
  );
}
