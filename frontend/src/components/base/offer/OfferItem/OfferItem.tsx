/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BiCoinStack } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { FaPen, FaTrash } from 'react-icons/fa';
import { FaDisplay } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { LuScrollText } from 'react-icons/lu';
import { MdAccessTime } from 'react-icons/md';

import {
  EMPLOYMENT_TYPE_MAP,
  OPERATING_MODE_MAP,
  SALARY_MAP,
} from '@Common/maps';
import { CompanyLogo } from '@Components/base/company';
import { DropdownItem, DropdownMenu, Modal } from '@Components/shared';
import { DeleteOfferForm } from '@Containers/offer';
import { OfferPreview } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import styles from './OfferItem.module.css';

type Props = {
  companyId: string;
  offer: OfferPreview;
  isOwner?: boolean;
};

export function OfferItem({
  companyId,
  offer,
  isOwner = false,
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const {
    id,
    title,
    position,
    isPaid,
    isActive,
    employmentTypeId,
    operatingModeId,
    locations,
    company,
  } = offer;
  const { logoUrl, name } = company;

  return isOwner ? (
    <article className={styles.container}>
      <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />
      <div className={styles.data}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <DropdownMenu
            LeftIcon={IoMdSettings}
            listClassName={styles.dropdownList}
            isBottom
          >
            <DropdownItem path={`${ROUTER_PATHS.COMPANY_OFFERS}/${id}`} isLink>
              <FaDisplay /> Pełan oferta
            </DropdownItem>
            <DropdownItem
              path={`${ROUTER_PATHS.COMPANY_OFFERS}/${id}/update`}
              isLink
            >
              <FaPen /> Zaktualizuj dane
            </DropdownItem>
            <DropdownItem onClick={openModal} isLink={false}>
              <FaTrash /> Usuń ofertę
            </DropdownItem>
          </DropdownMenu>
        </div>
        <div className={styles.baseInfo}>
          <p>
            Stanowisko: <span>{position}</span>
          </p>
          <p>
            Firma: <span>{name}</span>
          </p>
          <p>
            Lokalizacja: <span>{locations.join(',')}</span>
          </p>
        </div>
        <div className={styles.otherInfo}>
          <p className={styles.p}>
            <LuScrollText />
            {EMPLOYMENT_TYPE_MAP.get(employmentTypeId)}
          </p>
          <p className={styles.p}>
            <BiCoinStack />
            {SALARY_MAP.get(isPaid)}
          </p>
          <p className={styles.p}>
            <BsBriefcase /> {OPERATING_MODE_MAP.get(operatingModeId)}
          </p>
          <p className={styles.p}>
            <MdAccessTime />
            Status: {isActive ? 'Aktywna' : 'Nieaktywna'}
          </p>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClick={closeModal}>
          <DeleteOfferForm
            companyId={companyId}
            offerId={id}
            closeModal={closeModal}
          />
        </Modal>
      )}
    </article>
  ) : (
    <Link to={`${ROUTER_PATHS.OFFERS}/${id}`}>
      <article className={styles.container}>
        <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />
        <div className={styles.data}>
          <div className={styles.header}>
            <h3>{title}</h3>
          </div>
          <div className={styles.baseInfo}>
            <p>
              Stanowisko: <span>{position}</span>
            </p>
            <p>
              Firma: <span>{name}</span>
            </p>
            <p>
              Lokalizacja: <span>{locations.join(',')}</span>
            </p>
          </div>
          <div className={styles.otherInfo}>
            <p className={styles.p}>
              <LuScrollText />
              {EMPLOYMENT_TYPE_MAP.get(employmentTypeId)}
            </p>
            <p className={styles.p}>
              <BiCoinStack />
              {SALARY_MAP.get(isPaid)}
            </p>
            <p className={styles.p}>
              <BsBriefcase /> {OPERATING_MODE_MAP.get(operatingModeId)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
