import { ReactElement } from 'react';
import { isEmpty } from 'ramda';
import clsx from 'clsx';

import styles from './PicturePreview.module.css';

type Props = {
  alt: string;
  image: string;
  width: string;
  height: string;
  src?: string;
  className?: string;
  radius?: string;
};

export function PicturePreview({
  alt,
  image,
  width,
  height,
  src = '',
  className,
  radius = '0px',
}: Props): ReactElement {
  let imageUrl = image;

  if (!isEmpty(src)) {
    imageUrl = src;
  }

  return (
    <div
      className={clsx(styles.container, className)}
      style={{ width, height, borderRadius: radius }}
    >
      <picture className={styles.imagePicture}>
        <img className={styles.imageImg} src={imageUrl} alt={alt} />
      </picture>
    </div>
  );
}
