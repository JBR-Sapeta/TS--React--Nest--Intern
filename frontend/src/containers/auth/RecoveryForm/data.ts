import { isEmpty } from 'ramda';

import { isValidEmail } from '@Common/validation';
import { AccountRecoveryBody } from '@Data/types';

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
];

export function validateFormData({ email }: AccountRecoveryBody) {
  const emailMsg = isValidEmail(email);

  if (isEmpty(emailMsg)) {
    return null;
  }

  return {
    email: emailMsg,
  };
}
