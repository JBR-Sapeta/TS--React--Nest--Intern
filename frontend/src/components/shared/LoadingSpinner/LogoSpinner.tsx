import clsx from 'clsx';

import styles from './LogoSpinner.module.css';

type Props = {
  size: 'small' | 'large';
};

function LoadingSpinner({ size }: Props) {
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
    <picture className={containerClassName}>
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Ładowanie"
        className={styles.background}
      >
        <g clipPath="url(#clip0_708_2473)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M256 512C397.385 512 512 397.385 512 256C512 135.536 428.795 34.5053 316.719 7.24391C411.546 40.0853 482.174 149.526 475.573 227.174C479.389 293.53 431.053 388.86 359.492 439.003C417.183 389.15 466.742 305.883 466.742 225.623C466.742 126.778 388.189 36.7427 316.437 7.17549C297.059 2.48533 276.82 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_708_2473">
            <rect width="512" height="512" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <p className={messageClassName}>ładowanie...</p>
      <div className={circleClassName}>
        <div className={arrowClassName}> </div>
      </div>
    </picture>
  );
}

export default LoadingSpinner;
