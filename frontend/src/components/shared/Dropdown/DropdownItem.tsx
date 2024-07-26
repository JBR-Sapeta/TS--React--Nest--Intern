import type { ReactNode, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import styles from './DropdownItem.module.css';

type Props =
  | {
      isLink: false;
      children: ReactNode;
      onClick: VoidFunction;
      path?: never;
    }
  | {
      isLink: true;
      children: ReactNode;
      onClick?: never;
      path: string;
    };

export function DropdownItem({
  isLink,
  children,
  onClick,
  path,
}: Props): ReactElement {
  return isLink ? (
    <Link className={styles.dropdownItem} to={path}>
      {children}
    </Link>
  ) : (
    <button type="button" className={styles.dropdownItem} onClick={onClick}>
      {children}
    </button>
  );
}
