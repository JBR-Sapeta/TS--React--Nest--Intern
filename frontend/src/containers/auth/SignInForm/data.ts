import { isEmpty } from 'ramda';

import { isNotEmptyString, isValidEmail } from '@Common/validation';

type FormFields = {
  name: 'email' | 'password';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'email',
    type: 'email',
    label: { id: '1-email', text: 'Email' },
    placeholder: '',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: { id: '2-password', text: 'Hasło' },
    placeholder: '',
    required: true,
  },
];

export type SignInData = {
  email: string;
  password: string;
};

export function validateFormData({ email, password }: SignInData) {
  const emailMsg = isValidEmail(email);
  const passwordMsg = isNotEmptyString(password, 'Wprowadź hasło.');

  if ([emailMsg, passwordMsg].every((val) => isEmpty(val))) {
    return null;
  }

  return {
    email: emailMsg,
    password: passwordMsg,
  };
}
