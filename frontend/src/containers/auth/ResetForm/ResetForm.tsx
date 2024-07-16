import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import { ROUTER_PATHS } from '@Router/constants';
import { AuthHeader, AuthSideCard } from '@Components/base';
import { BaseButton, BaseInput } from '@Components/shared';

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

function ResetForm(): ReactElement {
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
