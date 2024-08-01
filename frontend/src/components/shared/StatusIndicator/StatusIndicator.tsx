import type { ReactElement } from 'react';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import clsx from 'clsx';

import styles from './StatusIndicator.module.css';

type Props = {
  isActive: boolean;
  activLabel: string;
  inactiveLable: string;
  hasColors?: boolean;
};

export function StatusIndicator({
  isActive,
  activLabel,
  inactiveLable,
  hasColors = false,
}: Props): ReactElement {
  return (
    <p
      className={clsx(styles.p, {
        [styles.green]: isActive && hasColors,
        [styles.red]: !isActive && hasColors,
      })}
    >
      {isActive ? <FaCircleCheck /> : <FaCircleXmark />}
      <span> {isActive ? activLabel : inactiveLable}</span>
    </p>
  );
}
