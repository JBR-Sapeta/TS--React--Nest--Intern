import clsx from 'clsx';
import type { ReactElement, PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

import styles from './BaseLink.module.css';

type Props = PropsWithChildren<{
  size: 'small' | 'medium';
  color: 'red' | 'orange' | 'blue' | 'green' | 'plain';
  path: string;
  className?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}>;

function BaseLink({
  size,
  color,
  path,
  children,
  className,
  LeftIcon,
  RightIcon,
}: Props): ReactElement {
  const linkClassNames = clsx(
    styles.link,
    styles[size],
    styles[color],
    className
  );

  return (
    <Link to={path} className={linkClassNames}>
      {LeftIcon && <LeftIcon />} {children} {RightIcon && <RightIcon />}
    </Link>
  );
}

export default BaseLink;
