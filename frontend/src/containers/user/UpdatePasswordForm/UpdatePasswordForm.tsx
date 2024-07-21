import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { isNil } from 'ramda';

import { BaseButton, BaseInput, Hr } from '@Components/shared';
import { useUpdatePassword } from '@Data/user';
import { getErrorMessages } from '@Data/utils';

import { FORM_FIELDS, validateFormData } from './data';

import type { UpdatePasswordFormData } from './data';

import styles from './UpdatePasswordForm.module.css';

const INITIAL_STATE: UpdatePasswordFormData = {
  password: '',
  newPassword: '',
  confirmPassword: '',
};

type Props = {
  closeModal: () => void;
};

function UpdatePasswordForm({ closeModal }: Props): ReactElement {
  const { isPending, data, error, updatePasswordMutation } =
    useUpdatePassword();
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_STATE);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validateFormData(values);

    if (!isNil(validationErrors)) {
      setErrors(validationErrors);
    } else {
      updatePasswordMutation(values);
    }
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
      <h2>Email</h2>
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
        Zmień hasło
      </BaseButton>
    </form>
  );
}

export default UpdatePasswordForm;
