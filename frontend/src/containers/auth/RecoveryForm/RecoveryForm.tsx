import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { isNil } from 'ramda';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';
import { useAccountRecovery } from '@Data/query/auth';
import { extractValidationError } from '@Data/utils';
import { AccountRecoveryBody, AccountRecoveryError } from '@Data/types';

import { AuthForms } from '../enum';
import { FORM_FIELDS, validateFormData } from './data';

import styles from './RecoveryForm.module.css';

const INITIAL_STATE: AccountRecoveryBody = {
  email: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function RecoveryForm({ changeForm }: Props): ReactElement {
  const { isPending, data, error, accountRecoveryMutation } =
    useAccountRecovery();
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_STATE);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validateFormData(values);

    if (isNil(validationErrors)) {
      accountRecoveryMutation(values);
    } else {
      setErrors(validationErrors);
    }
  };

  const validationErrors = extractValidationError<AccountRecoveryError>(
    INITIAL_STATE,
    error
  );

  return (
    <div className={styles.container}>
      <AuthSideCard
        hasLink={false}
        fisrtButton={{
          label: 'Zarejestruj się',
          onClick: () => changeForm(AuthForms.SIGN_UP),
        }}
        secondButton={{
          label: 'Zaloguj się',
          onClick: () => changeForm(AuthForms.SIGN_IN),
        }}
      />
      <form className={styles.form} onSubmit={onSubmit}>
        <AuthHeader header="Odzyskaj konto" subHeader="Zresetuj hasło" />
        <div className={styles.inputs}>
          <BaseInput
            inputSize="small"
            onChange={onChange}
            value={values.email}
            error={errors.email || validationErrors.email}
            {...FORM_FIELDS[0]}
          />
          <p>
            Wprowadź adres e-mail powiązany z kontem, a my prześlemy wiadomość z
            kolejnymi instrukcjami.
          </p>
        </div>
        <BaseButton
          size="medium"
          color="green"
          type="submit"
          className={styles.button}
          disabled={isPending || !!data}
        >
          Zresetuj hasło
        </BaseButton>
      </form>
    </div>
  );
}

export default RecoveryForm;
