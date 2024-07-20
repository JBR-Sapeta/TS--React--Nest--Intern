import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { isNil } from 'ramda';

import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';
import { useSignUp } from '@Data/auth';
import { extractValidationError } from '@Data/utils';
import { SignUpBody, SignUpError } from '@Data/types';

import { AuthForms } from '../enum';
import { FORM_FIELDS, validateFormData } from './data';

import styles from './SignUpForm.module.css';

const INITIAL_STATE: SignUpBody = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

type Props = {
  changeForm: (data: AuthForms) => void;
};

function SignUpForm({ changeForm }: Props): ReactElement {
  const { isPending, error, signUpMutation } = useSignUp();
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
      signUpMutation(values);
    } else {
      setErrors(validationErrors);
    }
  };

  const validationErrors = extractValidationError<SignUpError>(
    INITIAL_STATE,
    error
  );

  return (
    <div className={styles.container}>
      <AuthSideCard
        hasLink={false}
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
          Zarejestruj się
        </BaseButton>
      </form>
    </div>
  );
}

export default SignUpForm;
