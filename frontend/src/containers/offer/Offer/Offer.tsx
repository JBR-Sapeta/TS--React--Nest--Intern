import { useState } from 'react';
import type { ReactElement } from 'react';
import { isNil } from 'ramda';

import { UserRole } from '@Common/enums';
import { hasRoles } from '@Common/functions';
import { Nullable, Role } from '@Common/types';
import { CategoryTag, OfferPreviewHeader } from '@Components/base';
import { BaseButton, BaseLink, Modal } from '@Components/shared';
import { CreateApplicationForm } from '@Containers/application';
import type { OfferData } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import { BranchSection } from '../../branch';

import styles from './Offer.module.css';

type Props = OfferData & { applications: number[]; userRoles?: Role[] };

export function Offer({
  id: offerId,
  company,
  title,
  position,
  operatingModeId,
  employmentTypeId,
  isPaid,
  isActive,
  description,
  categories,
  branches,
  applications,
  userRoles,
}: Props): Nullable<ReactElement> {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { id: companyId, logoUrl, size, name, slug } = company;
  const hasApplication = applications.includes(offerId);
  const isUser = userRoles ? hasRoles(userRoles, [UserRole.USER]) : false;

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <OfferPreviewHeader
          title={title}
          position={position}
          operatingModeId={operatingModeId}
          employmentTypeId={employmentTypeId}
          isPaid={isPaid}
          companyName={name}
          logoUrl={logoUrl}
          size={size}
          hasApplication={hasApplication}
          slug={slug}
        />
        <div className={styles.description}>
          <h3>Opis stanowiska</h3>
          <p>{description}</p>
        </div>
        <div className={styles.tags}>
          {categories.map((cat) => (
            <CategoryTag key={cat.id} name={cat.name} />
          ))}
        </div>
        <BranchSection branches={branches} companyId={companyId} />

        {isActive && isUser && (
          <div className={styles.controls}>
            {hasApplication ? (
              <BaseLink
                size="medium"
                color="red"
                path={ROUTER_PATHS.USER_APPLICATIONS}
                className={styles.link}
              >
                Zarządzaj aplikacjami
              </BaseLink>
            ) : (
              <BaseButton size="medium" color="green" onClick={openModal}>
                Aplikuj
              </BaseButton>
            )}
          </div>
        )}

        {isNil(userRoles) && (
          <div className={styles.controls}>
            <BaseLink
              size="medium"
              color="green"
              path={ROUTER_PATHS.AUTH}
              className={styles.authLink}
            >
              Aplikuj
            </BaseLink>
          </div>
        )}
      </section>
      {isModalOpen && (
        <Modal onClick={closeModal}>
          <CreateApplicationForm
            offerId={offerId}
            closeModal={closeModal}
            title={title}
            position={position}
            companyName={name}
            logoUrl={logoUrl}
          />
        </Modal>
      )}
    </div>
  );
}
