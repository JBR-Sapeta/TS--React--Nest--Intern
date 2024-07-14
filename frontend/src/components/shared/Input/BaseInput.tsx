import { useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';
import { isEmpty } from 'ramda';

import styles from './BaseInput.module.css';

type Props = {
  inputSize: 'small' | 'medium';
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: { id: string; text: string };
  error?: string;
  Icon?: IconType;
} & Partial<HTMLInputElement>;

function BaseInput({
  inputSize,
  value,
  name,
  className,
  onChange,
  type,
  placeholder,
  label,
  Icon,
  error = '',
}: Props): ReactElement {
  const [focused, setFocused] = useState<boolean>(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const showError = !isEmpty(error);

  const containerClassName = clsx(styles.container, styles[inputSize], {
    [styles.active]: focused,
    [styles.error]: showError,
    className,
  });
  return (
    <div className={containerClassName}>
      {Icon && <Icon />}
      {label && <label htmlFor={label.id}>{label.text}</label>}
      <input
        id={label.id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <span className={styles.message}>{showError && error}</span>
    </div>
  );
}

export default BaseInput;
