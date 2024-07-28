/* eslint-disable jsx-a11y/label-has-associated-control */
import type { ChangeEvent, ReactElement } from 'react';
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
}: Props): ReactElement {
  const containerClassName = clsx(styles.container, className, {
    [styles.error]: !!error,
  });

  return (
    <div className={clsx(containerClassName)}>
      <label htmlFor={label.id}>{label.text}</label>
      <select
        name={name}
        id={label.id}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.select}
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
