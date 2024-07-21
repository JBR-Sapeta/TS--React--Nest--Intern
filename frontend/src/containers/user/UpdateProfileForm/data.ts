import { FaUser, FaPhoneAlt } from 'react-icons/fa';

import type { IconType } from 'react-icons';

type FormFields = {
  name: 'firstName' | 'lastName' | 'phoneNumber';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
  Icon: IconType;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'firstName',
    type: 'text',
    label: { id: '1-firstName', text: 'Imię' },
    placeholder: '',
    required: true,
    Icon: FaUser,
  },
  {
    name: 'lastName',
    type: 'text',
    label: { id: '2-lastName', text: 'Nazwisko' },
    placeholder: '',
    required: true,
    Icon: FaUser,
  },
  {
    name: 'phoneNumber',
    type: 'text',
    label: { id: '3-phoneNumber', text: 'Telefon' },
    placeholder: '',
    required: true,
    Icon: FaPhoneAlt,
  },
];
