import type { FormEvent, ReactElement } from 'react';
import { MdSearch } from 'react-icons/md';
import { FaBuilding, FaLink } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa6';

import { BaseButton, BaseInput, CheckboxInput, Hr } from '@Components/shared';
import type {
  UseAdminCompanySearchParams,
  AdminCompanySearchParamsState,
} from '@Hooks/index';

import styles from './AdminCompanySearchParams.module.css';

type Props = UseAdminCompanySearchParams & {
  setParams: (data: AdminCompanySearchParamsState) => void;
};

export function AdminCompanySearchParams({
  values,
  changeName,
  changeSlug,
  changeEmail,
  changeOwner,
  changeIsVerified,
  changeSearchParams,
  setParams,
}: Props): ReactElement {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    changeSearchParams(values);
    setParams(values);
  };

  return (
    <form className={styles.article} onSubmit={onSubmit}>
      <h2>Szukaj firmy</h2>
      <Hr className={styles.hr} />
      <div className={styles.inputs}>
        <BaseInput
          type="text"
          inputSize="small"
          name="name"
          label={{ id: '1-name', text: 'Nazwa firmy' }}
          Icon={FaBuilding}
          value={values.name}
          onChange={changeName}
        />
        <BaseInput
          type="text"
          inputSize="small"
          name="slug"
          label={{ id: '2-slug', text: 'Slug' }}
          Icon={FaLink}
          value={values.slug}
          onChange={changeSlug}
        />
        <BaseInput
          type="email"
          inputSize="small"
          name="email"
          label={{ id: '3-email', text: 'Email firmy' }}
          Icon={FaEnvelope}
          value={values.email}
          onChange={changeEmail}
        />
        <div className={styles.checkboxes}>
          <div className={styles.checkbox}>
            <span>Dodatkowe dane </span>
            <CheckboxInput
              name="owner"
              label={{ id: '4-owner', text: 'Użytkownik' }}
              value={values.owner}
              onChange={changeOwner}
            />
          </div>
          <div className={styles.checkbox}>
            <span>Status</span>
            <CheckboxInput
              name="isVerified"
              label={{ id: '5-isVerified', text: 'Zweryfikowane' }}
              value={values.isVerified}
              onChange={changeIsVerified}
            />
          </div>
        </div>
      </div>
      <BaseButton
        type="submit"
        size="medium"
        color="green"
        LeftIcon={MdSearch}
        className={styles.button}
      >
        Szukaj
      </BaseButton>
    </form>
  );
}
