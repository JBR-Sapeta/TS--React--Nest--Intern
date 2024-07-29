import { useState } from 'react';
import type { ReactElement } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { BsMailbox2 } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { PiMountainsFill } from 'react-icons/pi';
import clsx from 'clsx';

import { capitalize } from '@Common/functions';
import { DropdownItem, DropdownMenu, Modal } from '@Components/shared';
import { DeleteBranchForm } from '@Containers/branch';
import { Branch } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import styles from './BranchItem.module.css';

type Props = Branch & {
  isSelected: boolean;
  onClick: (id: number) => void;
  companyId?: string;
  isOwner?: boolean;
};

export function BranchItem({
  id,
  name,
  address,
  companyId,
  onClick,
  isSelected,
  isOwner = false,
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const { region, postcode, city, streetName, houseNumber } = address;

  const regionShort = region.split(' ')[1];

  const containerClassName = clsx(styles.container, {
    [styles.selectedContainer]: isSelected,
  });

  const addressClassName = clsx(styles.address, {
    [styles.selectedAddress]: isSelected,
  });

  return isOwner && companyId ? (
    <article className={containerClassName}>
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
          <DropdownItem
            path={`${ROUTER_PATHS.COMPANY_BRANCHES}/${id}/update`}
            isLink
          >
            <FaPen /> Zaktualizuj dane
          </DropdownItem>
          <DropdownItem onClick={openModal} isLink={false}>
            <FaTrash /> Usuń oddział
          </DropdownItem>
        </DropdownMenu>
      </div>
      <div className={addressClassName}>
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
      {isModalOpen && (
        <Modal onClick={closeModal}>
          <DeleteBranchForm
            companyId={companyId}
            branchId={id}
            closeModal={closeModal}
          />
        </Modal>
      )}
    </article>
  ) : (
    <button type="button" onClick={() => onClick(id)} className={styles.button}>
      <div className={containerClassName}>
        <div className={styles.header}>
          <h4>{name}</h4>
        </div>
        <div className={addressClassName}>
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
      </div>
    </button>
  );
}
