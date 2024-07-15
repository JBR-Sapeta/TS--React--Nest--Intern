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
    label: { id: '1-firstName', text: 'Imię' },
    placeholder: '',
    required: true,
  },
  {
    name: 'lastName',
    type: 'text',
    label: { id: '2-lastName', text: 'Nazwisko' },
    placeholder: '',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: { id: '3-email', text: 'Email' },
    placeholder: '',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: { id: '4-password', text: 'Hasło' },
    placeholder: '',
    required: true,
  },
];
