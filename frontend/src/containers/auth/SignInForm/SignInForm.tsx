import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { isNil } from 'ramda';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';
import { useSignIn } from '@Data/query/auth';
import { extractValidationError } from '@Data/utils';
import { SignInBody, SignInError } from '@Data/types';

import { AuthForms } from '../enum';
import { FORM_FIELDS, validateFormData } from './data';

import styles from './SignInForm.module.css';

const INITIAL_STATE: SignInBody = {
  email: '',
  password: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function SignInForm({ changeForm }: Props): ReactElement {
  const { isPending, error, signInMutation } = useSignIn();
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
      signInMutation(values);
    } else {
      setErrors(validationErrors);
    }
  };

  const validationErrors = extractValidationError<SignInError>(
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
