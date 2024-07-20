import clsx from 'clsx';

import styles from './PlainSpinner.module.css';

type Props = {
  size: 'small' | 'large';
};

function PlainSpinner({ size }: Props) {
  const containerClassName = clsx(styles.container, {
    [styles.smallContainer]: size === 'small',
  });
  const messageClassName = clsx(styles.message, {
    [styles.smallMessage]: size === 'small',
  });
  const circleClassName = clsx(styles.circle, {
    [styles.smallCircle]: size === 'small',
  });
  const arrowClassName = clsx(styles.arrow, {
    [styles.smallArrow]: size === 'small',
  });

  return (
    <section className={containerClassName}>
      <p className={messageClassName}>ładowanie...</p>
      <div className={circleClassName}>
        <div className={arrowClassName}> </div>
      </div>
    </section>
  );
}

export default PlainSpinner;
