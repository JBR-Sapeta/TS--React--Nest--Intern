import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { isNil } from 'ramda';

import { BaseButton, BaseInput, Hr } from '@Components/shared';
import { useDeleteProfil } from '@Data/query/user';
import { getErrorMessages } from '@Data/utils';

import { FORM_FIELDS, validateFormData } from './data';
import type { DeleteProfilFormData } from './data';

import styles from './DeleteProfileForm.module.css';

const INITIAL_STATE: DeleteProfilFormData = {
  password: '',
  confirmPassword: '',
};

type Props = {
  closeModal: () => void;
};

function DeleteProfileForm({ closeModal }: Props): ReactElement {
  const { isPending, error, deleteProfilMutation } = useDeleteProfil();
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
      deleteProfilMutation({ password: values.password });
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
      <h2>Konto</h2>
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
        </div>
      </div>
      <BaseButton
        size="medium"
        color="green"
        type="submit"
        className={styles.button}
        disabled={isPending}
      >
        Usuń konto
      </BaseButton>
    </form>
  );
}

export default DeleteProfileForm;
