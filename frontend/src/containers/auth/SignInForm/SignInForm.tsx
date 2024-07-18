import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';
import { useSignIn } from '@Data/auth';
import { extractValidationError } from '@Data/utils';

import { AuthForms } from '../enum';
import { FORM_FIELDS } from './data';

import styles from './SignInForm.module.css';

export type SignInData = {
  email: string;
  password: string;
};

const initialState: SignInData = {
  email: '',
  password: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function SignInForm({ changeForm }: Props): ReactElement {
  const { error, signInMutation, isPending } = useSignIn();
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    signInMutation(values);
  };

  const validationErrors = extractValidationError<SignInData>(
    initialState,
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
          label: 'Odzyskaj konto',
          onClick: () => changeForm(AuthForms.RECOVERY),
        }}
      />
      <form className={styles.form} onSubmit={onSubmit}>
        <AuthHeader header="Logowanie" subHeader="Witamy ponownie" />
        <div className={styles.inputs}>
          {FORM_FIELDS.map((input) => (
            <BaseInput
              inputSize="small"
              key={input.name}
              {...input}
              onChange={onChange}
              value={values[input.name]}
              error={errors[input.name] || validationErrors[input.name]}
            />
          ))}
        </div>
        <BaseButton
          size="medium"
          color="green"
          type="submit"
          className={styles.button}
          disabled={isPending}
        >
          Zaloguj się
        </BaseButton>
      </form>
    </div>
  );
}

export default SignInForm;
