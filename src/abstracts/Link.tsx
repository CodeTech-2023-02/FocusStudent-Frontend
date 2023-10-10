import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({});

interface RouterLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

export const RouterLinkComposed = React.forwardRef<
  HTMLAnchorElement,
  RouterLinkComposedProps
>(function RouterLinkComposed(props, ref) {
  const { to, ...other } = props;

  return (
    <RouterLink to={to} ref={ref} {...other}>
      <Anchor />
    </RouterLink>
  );
});

export type LinkProps = {
  activeClassName?: string;
  href: string;
  noLinkStyle?: boolean;
} & Omit<RouterLinkComposedProps, 'to' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
) {
  const {
    activeClassName = 'active',
    className: classNameProps,
    href,
    noLinkStyle,
    ...other
  } = props;

  const location = useLocation();
  const className = clsx(classNameProps, {
    [activeClassName]: location.pathname === href && activeClassName
  });

  const isExternal =
    typeof href === 'string' &&
    (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

  if (isExternal) {
    if (noLinkStyle) {
      return <Anchor className={className} href={href} ref={ref} {...other} />;
    }

    return <MuiLink className={className} href={href} ref={ref} {...other} />;
  }

  if (noLinkStyle) {
    return (
      <RouterLinkComposed className={className} ref={ref} to={href} {...other} />
    );
  }

  return (
    <MuiLink
      component={RouterLinkComposed}
      className={className}
      ref={ref}
      to={href}
      {...other}
    />
  );
});

export default Link;
