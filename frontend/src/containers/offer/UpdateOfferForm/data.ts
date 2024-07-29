import { isEmpty, omit } from 'ramda';

import type { Nullable } from '@Common/types';
import { isNotEmptyArray, isNotEmptyString } from '@Common/validation';
import type { FullOfferData, UpdateOfferBody } from '@Data/types';

import {
  UpdateOfferDataFormState,
  UpdateOfferFormErrors,
} from '../UpdateOfferDataForm/data';

export function validateFormData({
  title,
  position,
  description,
  employmentType,
  operatingMode,
  branches,
  categories,
}: UpdateOfferDataFormState & {
  branches: number[];
  categories: number[];
}): Nullable<UpdateOfferFormErrors> {
  const titleMsg = isNotEmptyString(title, 'Wprowadź nazwę oferty.');
  const positionMsg = isNotEmptyString(position, 'Wprowadź nazwę stanowiska.');
  const descriptionMsg = isNotEmptyString(
    description,
    'Wprowadź opis stanowiska.'
  );
  const employmentTypeMsg =
    +employmentType === 0 || Number.isNaN(+employmentType)
      ? 'Wybierz rodzaj zatrudnienia.'
      : '';

  const operatingModeMsg =
    +operatingMode === 0 || Number.isNaN(+operatingMode)
      ? 'Wybierz tryb pracy.'
      : '';

  const branchesMsg = isNotEmptyArray(
    branches,
    'Wybierz przynajmniej 1 oddział.'
  );
  const categoriesMsg = isNotEmptyArray(
    categories,
    'Wybierz przynajmniej 1 kategorie.'
  );

  if ([titleMsg, positionMsg, descriptionMsg].every((val) => isEmpty(val))) {
    return null;
  }

  return {
    title: titleMsg,
    position: positionMsg,
    expirationDate: '',
    description: descriptionMsg,
    employmentType: employmentTypeMsg,
    operatingMode: operatingModeMsg,
    branches: branchesMsg,
    categories: categoriesMsg,
  };
}

export function convertToCreateOfferBody(
  data: UpdateOfferDataFormState & {
    branches: number[];
    categories: number[];
  }
): UpdateOfferBody {
  const { employmentType, operatingMode, ...validData } = omit(
    ['expirationDate'],
    data
  );

  return {
    ...validData,
    employmentType: +employmentType,
    operatingMode: +operatingMode,
  };
}

export function convertOfferToProps({
  title,
  position,
  description,
  employmentTypeId,
  operatingModeId,
  expirationDate,
  isActive,
  isPaid,
}: FullOfferData): UpdateOfferDataFormState {
  const initialDate = expirationDate.split('T')[0];

  return {
    title,
    position,
    description,
    expirationDate: initialDate,
    isActive,
    isPaid,
    operatingMode: String(operatingModeId),
    employmentType: String(employmentTypeId),
  };
}
