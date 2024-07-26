import { isEmpty } from 'ramda';
import { IconType } from 'react-icons';
import { MdMail } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import {
  isLargerThan,
  isNotEmptyArray,
  isNotEmptyString,
  isValidEmail,
  isValidSlug,
} from '@Common/validation';
import { CreateCompanyBody } from '@Data/types';

type FormFields = {
  name: 'name' | 'slug' | 'email' | 'size' | 'description';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
  Icon?: IconType;
  step?: string;
  min?: string;
};

export const FORM_FIELDS: FormFields[] = [
  {
    name: 'name',
    type: 'text',
    label: { id: '1-name', text: 'Nazwa firmy' },
    placeholder: '',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: { id: '3-email', text: 'Email' },
    placeholder: '',
    required: true,
    Icon: MdMail,
  },
  {
    name: 'slug',
    type: 'text',
    label: { id: '2-slug', text: 'Slug' },
    placeholder: '',
    required: true,
  },

  {
    name: 'size',
    type: 'number',
    label: { id: '4-size', text: 'Liczba pracowników' },
    placeholder: '',
    required: true,
    step: '1',
    Icon: FaUsers,
    min: '0',
  },
];

export function validateFormData({
  name,
  slug,
  email,
  size,
  description,
  categories,
}: CreateCompanyBody) {
  const nameMsg = isNotEmptyString(name, 'Wprowadź nazwę firmy');
  const slugMsg = isValidSlug(slug);
  const emailMsg = isValidEmail(email);
  const sizeMsg = isLargerThan(size, 0);
  const descriptionMsg = isNotEmptyString(description, 'Wprowadź opis firmy.');
  const categoriesMsg = isNotEmptyArray(
    categories,
    'Wybierz przynajmniej 1 kategorie.'
  );

  if (
    [nameMsg, slugMsg, emailMsg, sizeMsg, descriptionMsg, categoriesMsg].every(
      (val) => isEmpty(val)
    )
  ) {
    return null;
  }

  return {
    name: nameMsg,
    slug: slugMsg,
    email: emailMsg,
    size: sizeMsg,
    description: descriptionMsg,
    categories: categoriesMsg,
  };
}
