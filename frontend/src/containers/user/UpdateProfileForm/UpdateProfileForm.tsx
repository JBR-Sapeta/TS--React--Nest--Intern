import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

import type { Nullable } from '@Common/types';
import { BaseButton, BaseInput, Hr } from '@Components/shared';
import { useUpdateProfile } from '@Data/query/user';
import { getErrorMessages } from '@Data/utils';
import type { UpdateProfileBody } from '@Data/types';

import { FORM_FIELDS } from './data';

import styles from './UpdateProfileForm.module.css';

const INITIAL_STATE: UpdateProfileBody = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

type Props = {
  firstName: string;
  lastName: string;
  phoneNumber: Nullable<string>;
  closeModal: () => void;
};

function UpdateProfilForm({ closeModal, ...restProps }: Props): ReactElement {
  const { isPending, data, error, updateProfileMutation } = useUpdateProfile();
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_STATE);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    updateProfileMutation(values);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <button
        type="button"
        aria-label="Zamknij okno"
        className={styles.close}
        onClick={closeModal}
      >
        <VscChromeClose />
      </button>
      <h2>Informacje</h2>
      <Hr />
      <div className={styles.inputs}>
        {FORM_FIELDS.map((input) => (
          <BaseInput
            inputSize="small"
            key={input.name}
            {...input}
            onChange={onChange}
            value={values[input.name]}
            error={errors[input.name]}
            placeholder={restProps[input.name] || ''}
          />
        ))}
        <div className={styles.message}>
          {error && <p className={styles.error}> {getErrorMessages(error)}</p>}
          {data && <p className={styles.success}> {data.message}</p>}
        </div>
      </div>
      <BaseButton
        size="medium"
        color="green"
        type="submit"
        className={styles.button}
        disabled={isPending}
      >
        Zapisz
      </BaseButton>
    </form>
  );
}

export default UpdateProfilForm;
