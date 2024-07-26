import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useResetCompanyImages } from '@Data/query/company';

import styles from './ResetImagesForm.module.css';

type Props = {
  companyId: string;
  closeModal: () => void;
};

export function ResetImagesForm({
  companyId,
  closeModal,
}: Props): ReactElement {
  const { resetCompanyImagesMutation } = useResetCompanyImages({ companyId });

  const onClick = () => {
    // @ TO DO - Add vheckbox input  to select image to reset
    resetCompanyImagesMutation({ logoUrl: true, mainPhotoUrl: true });
  };

  return (
    <div className={styles.container}>
      <h3>Usuń zdjęcia</h3>
      <Hr className={styles.hr} />
      <p>
        Czy jesteś pewien, że chcesz usunąć obecne logo firmy oraz zdjęcie
        główne?
      </p>
      <div className={styles.controls}>
        <BaseButton size="medium" color="red" onClick={onClick}>
          Usuń
        </BaseButton>
        <BaseButton size="medium" color="plain" onClick={closeModal}>
          Cofnij
        </BaseButton>
      </div>
    </div>
  );
}
