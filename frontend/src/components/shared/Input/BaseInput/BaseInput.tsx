import { useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';

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
  min,
  max,
  required,
  readOnly,
  step,
}: Props): ReactElement {
  const [focused, setFocused] = useState<boolean>(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const containerClassName = clsx(
    styles.container,
    styles[inputSize],
    {
      [styles.active]: focused,
      [styles.error]: !!error,
    },
    className
  );

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
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        required={required}
      />
      <span className={styles.message}>{!!error && error}</span>
    </div>
  );
}

export default BaseInput;
