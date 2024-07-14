/* eslint-disable react/button-has-type */
import type { ReactElement, ReactNode } from 'react';
import type { IconType } from 'react-icons';

import clsx from 'clsx';

import styles from './BaseButton.module.css';

type Props = {
  size: 'small' | 'medium';
  color: 'red' | 'orange' | 'blue' | 'green' | 'plain';
  onClick: () => void;
  children: ReactNode;
  className?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

function BaseButton({
  size,
  color,
  children,
  onClick,
  className,
  LeftIcon,
  RightIcon,
  type = 'button',
  disabled = false,
}: Props): ReactElement {
  const buttonClassNames = clsx(
    styles.button,
    styles[size],
    styles[color],
    className,
    {
      [styles.disabled]: disabled,
    }
  );

  return (
    <button
      className={buttonClassNames}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {LeftIcon && <LeftIcon />} {children} {RightIcon && <RightIcon />}
    </button>
  );
}

export default BaseButton;
