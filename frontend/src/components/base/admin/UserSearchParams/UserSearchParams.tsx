import type { FormEvent, ReactElement } from 'react';
import { MdSearch } from 'react-icons/md';
import { FaBuilding, FaLink } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa6';

import { BaseButton, BaseInput, CheckboxInput, Hr } from '@Components/shared';
import type { UseUserSearchParams, UserSearchParamsState } from '@Hooks/index';

import styles from './UserSearchParams.module.css';

type Props = UseUserSearchParams & {
  setParams: (data: UserSearchParamsState) => void;
};

export function UserSearchParams({
  values,
  changeFirstName,
  changeLastName,
  changeEmail,
  changeHasBan,
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
      <h2>Szukaj użytkownika</h2>
      <Hr className={styles.hr} />
      <div className={styles.inputs}>
        <BaseInput
          type="text"
          inputSize="small"
          name="firstName"
          label={{ id: '1-firstName', text: 'Imię' }}
          Icon={FaBuilding}
          value={values.firstName}
          onChange={changeFirstName}
        />
        <BaseInput
          type="text"
          inputSize="small"
          name="lastName"
          label={{ id: '2-lastName', text: 'Nazwisko' }}
          Icon={FaLink}
          value={values.lastName}
          onChange={changeLastName}
        />
        <BaseInput
          type="email"
          inputSize="small"
          name="email"
          label={{ id: '3-email', text: 'Email' }}
          Icon={FaEnvelope}
          value={values.email}
          onChange={changeEmail}
        />
        <div className={styles.checkboxes}>
          <div className={styles.checkbox}>
            <span>Status </span>
            <CheckboxInput
              name="hasBan"
              label={{ id: '4-hasBan', text: 'Zablokowany' }}
              value={values.hasBan}
              onChange={changeHasBan}
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
