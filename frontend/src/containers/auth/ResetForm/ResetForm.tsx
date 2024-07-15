import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';

import { AuthForms } from '../enum';
import { FORM_FIELDS } from './data';

import styles from './ResetForm.module.css';

export type ResetData = {
  password: string;
  confirmPassword: string;
};

const initialState: ResetData = {
  password: '',
  confirmPassword: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function ResetForm({ changeForm }: Props): ReactElement {
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
      {/* @ TO DO - Use Links  */}
      <AuthSideCard
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
        <AuthHeader header="Odzyskaj konto" subHeader="Ustaw nowe hasło" />
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
        </div>
        <BaseButton
          size="medium"
          color="green"
          type="submit"
          className={styles.button}
        >
          Ustaw hasło
        </BaseButton>
      </form>
    </div>
  );
}

export default ResetForm;
