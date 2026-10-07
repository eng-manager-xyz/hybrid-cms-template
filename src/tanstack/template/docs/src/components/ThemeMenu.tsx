'use client';

import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-provider';

const themeOptions = [
  { icon: SunIcon, label: 'Light', value: 'light' },
  { icon: MoonIcon, label: 'Dark', value: 'dark' },
  { icon: ComputerDesktopIcon, label: 'System', value: 'system' },
] as const;

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <fieldset
      className={[
        'inline-flex items-center gap-1 rounded-full p-0.5 shadow-lg',
        'sm:gap-1 sm:p-1',
        'border border-black/10 bg-black/5 shadow-black/10',
        'dark:border-white/10 dark:bg-[#18191d] dark:shadow-black/20',
      ].join(' ')}
    >
      <legend className="sr-only">Theme</legend>
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = mounted && theme === option.value;

        return (
          <button
            aria-label={`Switch to ${option.label} mode`}
            aria-pressed={isSelected}
            className={[
              'flex size-5 cursor-pointer items-center justify-center rounded-full',
              'sm:size-6',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--accent)]',
              isSelected
                ? 'bg-white text-black shadow-sm'
                : [
                    'text-[var(--text-muted)]',
                    'hover:bg-[var(--accent-soft)]',
                    'hover:text-[var(--accent)]',
                  ].join(' '),
            ].join(' ')}
            key={option.value}
            onClick={() => setTheme(option.value)}
            title={`Switch to ${option.label} mode`}
            type="button"
          >
            {mounted ? (
              <Icon className="size-3 fill-current text-current sm:size-3.5" />
            ) : (
              <span className="size-3 sm:size-3.5" />
            )}
          </button>
        );
      })}
    </fieldset>
  );
}
