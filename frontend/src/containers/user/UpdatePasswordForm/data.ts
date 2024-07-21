import { isEmpty } from 'ramda';
import { MdLock } from 'react-icons/md';
import type { IconType } from 'react-icons';

import { isNotEmptyString, isSameString } from '@Common/validation';

type FormFields = {
  name: 'password' | 'newPassword' | 'confirmPassword';
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
    label: { id: '1-password', text: 'Stare hasło' },
    placeholder: '',
    required: true,
    Icon: MdLock,
  },
  {
    name: 'newPassword',
    type: 'password',
    label: { id: '2-newPassword', text: 'Nowe hasło' },
    placeholder: '',
    required: true,
    Icon: MdLock,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: { id: '3-confirmPassword', text: 'Powtórz hasło' },
    placeholder: '',
    required: true,
    Icon: MdLock,
  },
];
export type UpdatePasswordFormData = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

export function validateFormData({
  password,
  newPassword,
  confirmPassword,
}: UpdatePasswordFormData) {
  const passwordMsg = isNotEmptyString(password, 'Wprowadź hasło.');
  const newPasswordMsg = isNotEmptyString(newPassword, 'Wprowadź nowe hasło.');
  const confirmPasswordMsg = isSameString(
    newPassword,
    confirmPassword,
    'Wprowadzone hasła nie są identyczne.'
  );

  if (
    [passwordMsg, newPasswordMsg, confirmPasswordMsg].every((val) =>
      isEmpty(val)
    )
  ) {
    return null;
  }

  return {
    password: passwordMsg,
    newPassword: newPasswordMsg,
    confirmPassword: confirmPasswordMsg,
  };
}
