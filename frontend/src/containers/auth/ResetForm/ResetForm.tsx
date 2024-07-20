import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isNil } from 'ramda';

import { ROUTER_PATHS, QUERY_PARAMS } from '@Router/constants';
import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';
import { useResetPassword } from '@Data/auth';
import { getErrorMessages } from '@Data/utils';
import { ResetPasswordError } from '@Data/types';

import { FORM_FIELDS, ResetFormData, validateFormData } from './data';

import styles from './ResetForm.module.css';

const INITIAL_STATE: ResetFormData = {
  password: '',
  confirmPassword: '',
};

function ResetForm(): ReactElement {
  const { isPending, error, resetPasswordMutation } = useResetPassword();
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_STATE);
  const [searchParams] = useSearchParams();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const resetToken = searchParams.get(QUERY_PARAMS.RESET_TOKEN);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validateFormData(values);

    if (!isNil(validationErrors)) {
      setErrors(validationErrors);
    } else if (!isNil(resetToken)) {
      resetPasswordMutation({ resetToken, password: values.password });
    }
  };

  return (
    <div className={styles.container}>
      <AuthSideCard
        hasLink
        link={{
          label: 'Zaloguj się',
          path: ROUTER_PATHS.AUTH,
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
          {error && (
            <p className={styles.error}>
              {getErrorMessages<ResetPasswordError>(error)}
            </p>
          )}
        </div>

        <BaseButton
          size="medium"
          color="green"
          type="submit"
          className={styles.button}
          disabled={isPending || !resetToken}
        >
          Ustaw hasło
        </BaseButton>
      </form>
    </div>
  );
}

export default ResetForm;
