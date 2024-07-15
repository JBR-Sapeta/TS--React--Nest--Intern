import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';

import { AuthForms } from '../enum';
import { FORM_FIELDS } from './data';

import styles from './SignUpForm.module.css';

export type SignInData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const initialState: SignInData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function SignUpForm({ changeForm }: Props): ReactElement {
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
        fisrtButton={{
          label: 'Zaloguj się',
          onClick: () => changeForm(AuthForms.SIGN_IN),
        }}
        secondButton={{
          label: 'Odzyskaj konto',
          onClick: () => changeForm(AuthForms.RECOVERY),
        }}
      />
      <form className={styles.form} onSubmit={onSubmit}>
        <AuthHeader header="Rejestracja" subHeader="Załóż konto za darmo" />
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
          Zarejestruj się
        </BaseButton>
      </form>
    </div>
  );
}

export default SignUpForm;
