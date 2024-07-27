import { isInRange, isNotEmptyString } from '@Common/validation';

import { isEmpty } from 'ramda';

type AddressFormFields = {
  name:
    | 'country'
    | 'region'
    | 'postcode'
    | 'city'
    | 'streetName'
    | 'houseNumber'
    | 'lat'
    | 'long';
  type: string;
  label: { id: string; text: string };
  placeholder: string;
  required: boolean;
  readOnly?: boolean;
  min?: string;
  max?: string;
  step?: string;
};

export type AddressFromData = {
  country: string;
  region: string;
  postcode: string;
  city: string;
  streetName: string;
  houseNumber: string;
  lat: string;
  long: string;
};

export const ADDRESS_FORM_FIELDS: AddressFormFields[] = [
  {
    name: 'country',
    type: 'text',
    label: { id: '1-country', text: 'Kraj' },
    placeholder: '',
    required: true,
  },
  {
    name: 'region',
    type: 'text',
    label: { id: '2-region', text: 'Województwo ' },
    placeholder: '',
    required: true,
  },
  {
    name: 'postcode',
    type: 'text',
    label: { id: '3-postcode', text: 'Kod pocztowy' },
    placeholder: '',
    required: true,
  },
  {
    name: 'city',
    type: 'text',
    label: { id: '4-city', text: 'Miasto' },
    placeholder: '',
    required: true,
  },
  {
    name: 'streetName',
    type: 'text',
    label: { id: '5-streetName', text: 'Ulica' },
    placeholder: '',
    required: true,
  },
  {
    name: 'houseNumber',
    type: 'text',
    label: { id: '6-houseNumber', text: 'Numer domu' },
    placeholder: '',
    required: true,
  },
  {
    name: 'lat',
    type: 'number',
    label: { id: '7-lat', text: 'Szerokość geograficzna (lat)' },
    placeholder: '',
    required: true,
    min: '-90',
    max: '90',
    step: '0.000001',
  },
  {
    name: 'long',
    type: 'number',
    label: { id: '8-long', text: 'Długość geograficzna (long)' },
    placeholder: '',
    required: true,
    min: '-180',
    max: '180',
    step: '0.000001',
  },
];

export function validateAddressFormData({
  country,
  region,
  postcode,
  city,
  streetName,
  houseNumber,
  lat,
  long,
}: AddressFromData) {
  const countryMsg = isNotEmptyString(country, 'Wprowadź kraj.');
  const regionMsg = isNotEmptyString(region, 'Wprowadź województwo.');
  const postcodeMsg = isNotEmptyString(postcode, 'Wprowadź kod pocztowy.');
  const cityMsg = isNotEmptyString(city, 'Wprowadź nazwę miasta.');
  const streetNameMsg = isNotEmptyString(streetName, 'Wprowadź nazwę ulicy.');
  const houseNumberMsg = isNotEmptyString(
    houseNumber,
    'Wprowadź numer budynku.'
  );
  const latMsg = isInRange(lat, -90, 90);
  const longMsg = isInRange(long, -180, 180);

  if (
    [
      countryMsg,
      regionMsg,
      postcodeMsg,
      cityMsg,
      streetNameMsg,
      houseNumberMsg,
      latMsg,
      longMsg,
    ].every((val) => isEmpty(val))
  ) {
    return null;
  }

  return {
    country: countryMsg,
    region: regionMsg,
    postcode: postcodeMsg,
    city: cityMsg,
    streetName: streetNameMsg,
    houseNumber: houseNumberMsg,
    lat: latMsg,
    long: longMsg,
  };
}

export type BranchFormData = {
  name: string;
};

export const BRANCH_FIELD = {
  name: 'name',
  type: 'text',
  label: { id: '0-name', text: 'Nazwa oddziału ' },
  placeholder: '',
  required: true,
};

export function validateBranchFormData({ name }: BranchFormData) {
  const nameMsg = isNotEmptyString(name, 'Wprowadź nazwę firmy.');

  if (isEmpty(nameMsg)) {
    return null;
  }

  return {
    name: nameMsg,
  };
}
