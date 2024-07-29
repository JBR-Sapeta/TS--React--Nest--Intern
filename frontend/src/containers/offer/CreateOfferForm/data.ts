import { isEmpty } from 'ramda';

import type { Nullable } from '@Common/types';
import { isNotEmptyArray, isNotEmptyString } from '@Common/validation';
import type { CreateOfferBody } from '@Data/types';

import {
  BaseOfferDataForm,
  CreateOfferFormErrors,
  OfferDataFormState,
} from '../CreateOfferDataForm/data';

const ONE_DAY = 24 * 60 * 60 * 1000;

export function validateFormData({
  title,
  position,
  expirationTime,
  description,
  employmentType,
  operatingMode,
  branches,
  categories,
}: BaseOfferDataForm & {
  branches: number[];
  categories: number[];
}): Nullable<CreateOfferFormErrors> {
  const titleMsg = isNotEmptyString(title, 'Wprowadź nazwę oferty.');
  const positionMsg = isNotEmptyString(position, 'Wprowadź nazwę stanowiska.');
  let expirationTimeMsg = isNotEmptyString(
    expirationTime,
    'Wprowadź datę wygasnięcia oferty.'
  );
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

  if (!isEmpty(expirationTime)) {
    const today = new Date().getTime();
    const expirationDate = new Date(expirationTime).getTime();
    const days = Math.ceil((expirationDate - today) / ONE_DAY);

    expirationTimeMsg =
      days < 7 ? 'Minimalny okres publikacji oferty to 7 dni' : '';
  }

  if (
    [titleMsg, positionMsg, expirationTimeMsg, descriptionMsg].every((val) =>
      isEmpty(val)
    )
  ) {
    return null;
  }

  return {
    title: titleMsg,
    position: positionMsg,
    expirationTime: expirationTimeMsg,
    description: descriptionMsg,
    employmentType: employmentTypeMsg,
    operatingMode: operatingModeMsg,
    branches: branchesMsg,
    categories: categoriesMsg,
  };
}

export function convertToCreateOfferBody(
  data: OfferDataFormState & {
    branches: number[];
    categories: number[];
  }
): CreateOfferBody {
  const {
    employmentType,
    operatingMode,
    expirationTime: expirationDate,
    ...validData
  } = data;

  const today = new Date().getTime();
  const expirationTime = Math.ceil(
    (new Date(expirationDate).getTime() - today) / ONE_DAY
  );

  return {
    ...validData,
    employmentType: +employmentType,
    operatingMode: +operatingMode,
    expirationTime,
  };
}
