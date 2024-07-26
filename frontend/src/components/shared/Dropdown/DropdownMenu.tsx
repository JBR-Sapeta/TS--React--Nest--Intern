import { ReactNode, useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';

import styles from './DropdownMenu.module.css';

type Props = {
  children: ReactNode;
  label?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  isBottom?: boolean;
};

export function DropdownMenu({
  children,
  LeftIcon,
  RightIcon,
  label = '',
  isBottom = false,
}: Props): ReactElement {
  const dropdownElement = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handler = (event: globalThis.MouseEvent): void => {
      if (!dropdownElement.current) {
        return;
      }

      if (!dropdownElement.current.contains(event.target as HTMLElement)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handler);

    return () => document.removeEventListener('click', handler);
  }, [setIsOpen]);

  const dropdownClassnames = clsx(styles.dropdown, {
    [styles.dropdownActive]: isOpen,
    [styles.dropdownLabelButton]: label,
  });

  const buttonClassNames = clsx(styles.dropdownButton, {
    [styles.labelButton]: label,
  });

  const listClassNames = clsx(styles.dropdownList, {
    [styles.bottomList]: isBottom,
    [styles.labelList]: label,
  });

  return (
    <div className={dropdownClassnames}>
      <button
        ref={dropdownElement}
        className={buttonClassNames}
        type="button"
        aria-label="Przycisk menu"
        onClick={() => setIsOpen((state) => !state)}
      >
        {LeftIcon && <LeftIcon />}
        {label}
        {RightIcon && <RightIcon />}
      </button>
      {isOpen && <div className={listClassNames}>{children}</div>}
    </div>
  );
}
