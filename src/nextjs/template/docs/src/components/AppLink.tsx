import Link from 'next/link';
import { type ComponentProps, forwardRef } from 'react';

type AppLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  prefetch?: boolean;
};

/** Internal paths use Next.js client navigation; everything else is a plain link. */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { href, children, prefetch, ...props },
  ref
) {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} prefetch={prefetch} {...props}>
      {children}
    </Link>
  );
});
