import type { ReactElement } from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { MdError } from 'react-icons/md';
import clsx from 'clsx';

import styles from './VerifiedLabel.module.css';

type Props = {
  isVerified: boolean;
};

export function VerifiedLabel({ isVerified }: Props): ReactElement {
  const containerClassName = clsx(styles.container, {
    [styles.green]: isVerified,
    [styles.red]: !isVerified,
  });

  return (
    <div className={containerClassName}>
      {isVerified ? <BsFillPatchCheckFill /> : <MdError />}
      <p>{isVerified ? 'Zweryfikowany' : 'Nie zweryfikowany'} </p>
    </div>
  );
}
