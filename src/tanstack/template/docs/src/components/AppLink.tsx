import { Link } from '@tanstack/react-router';
import { type ComponentProps, forwardRef } from 'react';

type AppLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  prefetch?: boolean;
};

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
    <Link ref={ref} to={href as never} preload={prefetch === false ? false : 'intent'} {...props}>
      {children}
    </Link>
  );
});
