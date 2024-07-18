import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';

import { AuthForms } from '../enum';
import { FORM_FIELDS } from './data';

import styles from './RecoveryForm.module.css';

export type RecoveryData = {
  email: string;
};

const initialState: RecoveryData = {
  email: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function RecoveryForm({ changeForm }: Props): ReactElement {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

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
            error={errors.email}
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
        >
          Zresetuj hasło
        </BaseButton>
      </form>
    </div>
  );
}

export default RecoveryForm;
