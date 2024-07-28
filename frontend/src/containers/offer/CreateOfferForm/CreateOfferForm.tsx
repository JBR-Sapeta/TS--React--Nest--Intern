import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import { isNil } from 'ramda';

import { BaseButton, Hr } from '@Components/shared';
import { extractValidationError } from '@Data/utils';
import { Branch, CategoryPreview, CreateOfferError } from '@Data/types';
import { useCreateOffer } from '@Data/query/offer';

import { SelectCategory } from '../../category';
import { SelectBranch } from '../../branch';
import { OfferDataForm } from '../OfferDataForm/OfferDataForm';
import {
  CreateOfferFormErrors,
  OfferDataFormState,
} from '../OfferDataForm/data';

import styles from './CreateOfferForm.module.css';

import { convertToCreateOfferBody, validateFormData } from './data';

const BASE_DATA_INITIAL_STATE: OfferDataFormState = {
  title: '',
  position: '',
  expirationTime: '',
  description: '',
  employmentType: '',
  operatingMode: '',
  isPaid: false,
  isActive: false,
};

const INITIAL_ERROR_STATE: CreateOfferFormErrors = {
  title: '',
  position: '',
  expirationTime: '',
  description: '',
  employmentType: '',
  operatingMode: '',
  branches: '',
  categories: '',
};

type Props = {
  branches: Branch[];
  companyId: string;
};

export function CreateOfferForm({ branches, companyId }: Props): ReactElement {
  const { isPending, error, createOfferMutation } = useCreateOffer({
    companyId,
  });
  const [baseData, setBaseData] = useState(BASE_DATA_INITIAL_STATE);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryPreview[]
  >([]);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const categoriesIds = selectedCategories.map((val) => val.id);

    const validationErrors = validateFormData({
      ...baseData,
      branches: selectedBranches,
      categories: categoriesIds,
    });

    if (isNil(validationErrors)) {
      const body = convertToCreateOfferBody({
        ...baseData,
        branches: selectedBranches,
        categories: categoriesIds,
      });

      createOfferMutation(body);
    } else {
      setErrors(validationErrors);
    }
  };

  const {
    categories: categoreisError,
    branches: branchesError,
    ...baseDataErrors
  } = extractValidationError<CreateOfferError>(INITIAL_ERROR_STATE, error);

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.data}>
        <h2>Nowa oferta</h2>
        <Hr />
        <OfferDataForm
          errors={errors}
          validationErrors={baseDataErrors}
          setErrors={setErrors}
          liftState={setBaseData}
        />
      </div>

      <div className={styles.categories}>
        <h3>
          <BsFillGrid3X3GapFill />
          Kategorie
        </h3>
        <SelectCategory
          selectCategory={setSelectedCategories}
          selectedCategories={selectedCategories}
          errorMessage={errors.categories || categoreisError}
        />
      </div>

      <div className={styles.branches}>
        <h3>
          <FaLocationDot />
          Wybierz oddział
        </h3>
        <SelectBranch
          branches={branches}
          selectedBranches={selectedBranches}
          selectBranch={setSelectedBranches}
          errorMessage={errors.branches || branchesError}
        />
        <BaseButton
          size="medium"
          color="green"
          type="submit"
          className={styles.button}
          disabled={isPending}
        >
          Dodaj ofertę
        </BaseButton>
      </div>
    </form>
  );
}
