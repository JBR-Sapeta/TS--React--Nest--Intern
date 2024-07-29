import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import { isNil } from 'ramda';

import { BaseButton, Hr } from '@Components/shared';
import { extractValidationError } from '@Data/utils';
import {
  Branch,
  CategoryPreview,
  CreateOfferError,
  FullOfferData,
} from '@Data/types';
import { useUpdateOffer } from '@Data/query/offer';

import { SelectCategory } from '../../category';
import { SelectBranch } from '../../branch';
import { UpdateOfferDataForm } from '../UpdateOfferDataForm/UpdateOfferDataForm';
import { UpdateOfferFormErrors } from '../UpdateOfferDataForm/data';
import {
  convertOfferToProps,
  convertToCreateOfferBody,
  validateFormData,
} from './data';

import styles from './UpdateOfferForm.module.css';

const INITIAL_ERROR_STATE: UpdateOfferFormErrors = {
  title: '',
  position: '',
  expirationDate: '',
  description: '',
  employmentType: '',
  operatingMode: '',
  branches: '',
  categories: '',
};

type Props = {
  branches: Branch[];
  companyId: string;
  offer: FullOfferData;
};

export function UpdateOfferForm({
  branches,
  companyId,
  offer,
}: Props): ReactElement {
  const initialBaseDataState = convertOfferToProps(offer);
  const { isPending, error, updateOfferMutation } = useUpdateOffer({
    companyId,
    offerId: offer.id,
  });
  const [baseData, setBaseData] = useState(initialBaseDataState);
  const [selectedBranches, setSelectedBranches] = useState<number[]>(
    offer.branches.map((val) => val.id)
  );
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryPreview[]
  >(offer.categories);
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

      updateOfferMutation(body);
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
        <UpdateOfferDataForm
          initialState={initialBaseDataState}
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
          Zapisz zmiany
        </BaseButton>
      </div>
    </form>
  );
}
