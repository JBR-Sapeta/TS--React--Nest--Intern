import type { ChangeEvent, ReactElement } from 'react';

import styles from './CheckoboxInput.module.css';

type Props = {
  name: string;
  label: { id: string; text: string };
  value: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function CheckboxInput({
  name,
  label,
  value,
  onChange,
  className,
}: Props): ReactElement {
  return (
    <div className={className}>
      <label htmlFor={label.id} className={styles.container}>
        <input
          name={name}
          id={label.id}
          type="checkbox"
          checked={value}
          onChange={onChange}
        />
        {label.text}
        <span className={styles.checkmark} />
      </label>
    </div>
  );
}
