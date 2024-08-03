/* eslint-disable jsx-a11y/label-has-associated-control */
import type { ChangeEvent, ReactElement } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';

import styles from './SelectInput.module.css';

type Props = {
  name: string;
  label: { id: string; text: string };
  options: Record<string, string>[];
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  className?: string;
  error?: string;
  Icon?: IconType;
  disabled?: boolean;
};

export function SelectInput({
  name,
  label,
  options,
  value,
  onChange,
  required = false,
  className,
  error,
  Icon,
  disabled = false,
}: Props): ReactElement {
  const containerClassName = clsx(styles.container, className, {
    [styles.error]: !!error,
    [styles.disabled]: disabled,
  });

  return (
    <div className={clsx(containerClassName)}>
      <label htmlFor={label.id}>
        {Icon && <Icon />}
        {label.text}
      </label>
      <select
        name={name}
        id={label.id}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.select}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.message}>{!!error && error}</span>
    </div>
  );
}
