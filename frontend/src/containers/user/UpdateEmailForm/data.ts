import { isEmpty } from 'ramda';
import { MdLock, MdMail } from 'react-icons/md';
import type { IconType } from 'react-icons';

import { isNotEmptyString, isValidEmail } from '@Common/validation';
import { UpdateEmailBody } from '@Data/types';

type FormFields = {
  name: 'newEmail' | 'password';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
  Icon: IconType;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'newEmail',
    type: 'email',
    label: { id: '1-newEmail', text: 'Nowy Email' },
    placeholder: '',
    required: true,
    Icon: MdMail,
  },
  {
    name: 'password',
    type: 'password',
    label: { id: '2-password', text: 'Hasło' },
    placeholder: '',
    required: true,
    Icon: MdLock,
  },
];

export function validateFormData({ newEmail, password }: UpdateEmailBody) {
  const emailMsg = isValidEmail(newEmail);
  const passwordMsg = isNotEmptyString(password, 'Wprowadź hasło.');

  if ([emailMsg, passwordMsg].every((val) => isEmpty(val))) {
    return null;
  }

  return {
    newEmail: emailMsg,
    password: passwordMsg,
  };
}
