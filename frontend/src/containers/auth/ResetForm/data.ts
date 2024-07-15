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
