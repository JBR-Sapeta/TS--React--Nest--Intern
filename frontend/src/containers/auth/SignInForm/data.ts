export type FormFields = {
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
    label: { id: '2-email', text: 'Email' },
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
