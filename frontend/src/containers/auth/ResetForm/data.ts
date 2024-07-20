import { isNotEmptyString, isSameString } from '@Common/validation';
import { isEmpty } from 'ramda';

type FormFields = {
  name: 'password' | 'confirmPassword';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'password',
    type: 'password',
    label: { id: '1-email', text: 'Hasło' },
    placeholder: '',
    required: true,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: { id: '2-password', text: 'Powtórz hasło' },
    placeholder: '',
    required: true,
  },
];

export type ResetFormData = {
  password: string;
  confirmPassword: string;
};

export function validateFormData({ password, confirmPassword }: ResetFormData) {
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
