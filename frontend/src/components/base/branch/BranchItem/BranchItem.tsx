import type { ReactElement } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { BsMailbox2 } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { PiMountainsFill } from 'react-icons/pi';

import { DropdownItem, DropdownMenu } from '@Components/shared';
import { capitalize } from '@Common/functions';
import { Branch } from '@Data/types';

import styles from './BranchItem.module.css';

type Props = Branch & {
  onClick: (id: number) => void;
  isOwner?: boolean;
};

export function BranchItem({
  id,
  name,
  address,
  onClick,
  isOwner = false,
}: Props): ReactElement {
  const { region, postcode, city, streetName, houseNumber } = address;

  const regionShort = region.split(' ')[1];

  return isOwner ? (
    <article className={styles.container}>
      <div className={styles.header}>
        <h4>{name}</h4>
        <DropdownMenu
          LeftIcon={IoMdSettings}
          listClassName={styles.dropdownList}
          isBottom
        >
          <DropdownItem onClick={() => onClick(id)} isLink={false}>
            <MdLocationOn /> Wycentruj mape
          </DropdownItem>
          <DropdownItem onClick={() => {}} isLink={false}>
            <FaPen /> Zaktualizuj dane
          </DropdownItem>
          <DropdownItem onClick={() => {}} isLink={false}>
            <FaTrash /> Usuń oddział
          </DropdownItem>
        </DropdownMenu>
      </div>
      <div className={styles.address}>
        <p className={styles.region}>
          <PiMountainsFill />
          {capitalize(regionShort)}
        </p>
        <p className={styles.city}>
          <MdLocationOn />
          {`${city} ${postcode}`}
        </p>
        <p className={styles.street}>
          <BsMailbox2 />
          {`${streetName} ${houseNumber}`}
        </p>
      </div>
    </article>
  ) : (
    <article className={styles.container}>
      <button
        type="button"
        onClick={() => onClick(id)}
        className={styles.button}
      >
        <div className={styles.header}>
          <h4>{name}</h4>
        </div>
        <div className={styles.address}>
          <p className={styles.region}>
            <PiMountainsFill />
            {capitalize(regionShort)}
          </p>
          <p className={styles.city}>
            <MdLocationOn />
            {`${city} ${postcode}`}
          </p>
          <p className={styles.street}>
            <BsMailbox2 />
            {`${streetName} ${houseNumber}`}
          </p>
        </div>
      </button>
    </article>
  );
}
