import { IconType } from 'react-icons';

export type UpdateOfferFormErrors = {
  title: string;
  position: string;
  expirationDate: string;
  description: string;
  employmentType: string;
  operatingMode: string;
  categories: string;
  branches: string;
};

export type UpdateOfferDataFormState = {
  title: string;
  position: string;
  expirationDate: string;
  description: string;
  employmentType: string;
  operatingMode: string;
  isPaid: boolean;
  isActive: boolean;
};

export type BaseOfferDataForm = {
  title: string;
  position: string;
  expirationDate: string;
  description: string;
  employmentType: string;
  operatingMode: string;
};

type FormFields = {
  name: 'title' | 'position' | 'expirationDate';
  type?: string;
  label: { id: string; text: string };
  placeholder: string;
  required?: boolean;
  Icon?: IconType;
  step?: string;
  min?: string;
  readonly?: boolean;
  disabled?: boolean;
};

export const BASE_FORM_FIELDS: FormFields[] = [
  {
    name: 'title',
    type: 'text',
    label: { id: '1-title', text: 'Tytuł oferty' },
    placeholder: '',
  },
  {
    name: 'position',
    type: 'text',
    label: { id: '3-emapositionil', text: 'Stanowisko' },
    placeholder: '',
  },
  {
    name: 'expirationDate',
    type: 'date',
    label: { id: '2-expirationDate', text: 'Data wygaśnięcia' },
    placeholder: '',
    readonly: true,
    disabled: true,
  },
];

type SelectFormFields = {
  name: 'employmentType' | 'operatingMode';
  label: { id: string; text: string };
  options: Record<string, string>[];
  required?: boolean;
};

export const FORM_SELECT_FIELDS: SelectFormFields[] = [
  {
    name: 'employmentType',
    label: { id: '1-title', text: 'Rodzaj zatrudnienie' },

    options: [
      { value: '0', label: 'Wybierz' },
      { value: '1', label: 'Staż' },
      { value: '2', label: 'Praktyki' },
      { value: '3', label: 'Praktyki zawodowe' },
      { value: '4', label: 'Praca w weekendy' },
      { value: '5', label: 'Praca w wakacje' },
    ],
  },
  {
    name: 'operatingMode',
    label: { id: '3-emapositionil', text: 'Tryb pracy' },
    options: [
      { value: '0', label: 'Wybierz' },
      { value: '1', label: 'Praca stacjonarna' },
      { value: '2', label: 'Praca zdalna' },
      { value: '3', label: 'Praca hybrydowa' },
    ],
  },
];

type CheckboxFormFields = {
  name: 'isPaid' | 'isActive';
  label: { id: string; text: string };
};

export const FORM_CHECKBOX_FIELDS: CheckboxFormFields[] = [
  {
    name: 'isPaid',
    label: { id: '1-isPaid', text: 'Z wynagrodzeniem' },
  },
  {
    name: 'isActive',
    label: { id: '2-isActive', text: 'Umieść na liście ogłoszeń' },
  },
];
