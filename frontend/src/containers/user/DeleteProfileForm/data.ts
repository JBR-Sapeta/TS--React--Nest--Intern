import { isEmpty } from 'ramda';
import { MdLock } from 'react-icons/md';
import type { IconType } from 'react-icons';

import { isNotEmptyString, isSameString } from '@Common/validation';

type FormFields = {
  name: 'password' | 'confirmPassword';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
  Icon: IconType;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'password',
    type: 'password',
    label: { id: '1-password', text: 'Hasło' },
    placeholder: '',
    required: true,
    Icon: MdLock,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: { id: '2-password', text: 'Powtórz hasło' },
    placeholder: '',
    required: true,
    Icon: MdLock,
  },
];
export type DeleteProfilFormData = {
  password: string;
  confirmPassword: string;
};

export function validateFormData({
  password,
  confirmPassword,
}: DeleteProfilFormData) {
  const passwordMsg = isNotEmptyString(password, 'Wprowadź hasło.');
  const confirmPasswordMsg = isSameString(
    password,
    confirmPassword,
    'Wprowadzone hasła nie są identyczne.'
  );

  if ([passwordMsg, confirmPasswordMsg].every((val) => isEmpty(val))) {
    return null;
  }

  return {
    confirmPassword: confirmPasswordMsg,
    password: passwordMsg,
  };
}
