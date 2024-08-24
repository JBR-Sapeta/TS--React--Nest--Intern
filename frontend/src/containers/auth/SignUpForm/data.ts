import { isNotEmptyString, isValidEmail } from '@Common/validation';
import { SignUpBody } from '@Data/types';
import { isEmpty } from 'ramda';

type FormFields = {
  name: 'firstName' | 'lastName' | 'email' | 'password';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'firstName',
    type: 'text',
    label: { id: 'firstName', text: 'Imię' },
    placeholder: '',
    required: true,
  },
  {
    name: 'lastName',
    type: 'text',
    label: { id: 'lastName', text: 'Nazwisko' },
    placeholder: '',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: { id: 'email', text: 'Email' },
    placeholder: '',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: { id: 'password', text: 'Hasło' },
    placeholder: '',
    required: true,
  },
];

export function validateFormData({
  firstName,
  lastName,
  email,
  password,
}: SignUpBody) {
  const fNameMsg = isNotEmptyString(firstName, 'Wprowadź imię.');
  const lNameMsg = isNotEmptyString(lastName, 'Wprowadź nazwisko.');
  const emailMsg = isValidEmail(email);
  const passwordMsg = isNotEmptyString(password, 'Wprowadź hasło.');

  if (
    [fNameMsg, lNameMsg, emailMsg, passwordMsg].every((val) => isEmpty(val))
  ) {
    return null;
  }

  return {
    firstName: fNameMsg,
    lastName: lNameMsg,
    email: emailMsg,
    password: passwordMsg,
  };
}
