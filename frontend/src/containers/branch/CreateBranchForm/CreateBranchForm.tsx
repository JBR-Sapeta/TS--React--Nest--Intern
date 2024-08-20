import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { isEmpty, isNil, isNotEmpty, omit } from 'ramda';

import { BranchMap } from '@Components/base';
import { BaseButton, BaseInput, Hr } from '@Components/shared';
import { getErrorMessages } from '@Data/utils';
import { useCreateBranch, useGetGeocoderData } from '@Data/query/branch';

import { BranchList } from '../BranchList/BranchList';

import {
  ADDRESS_SEARCH_PARAMS_FIELDS,
  BRANCH_FIELD,
  BranchFormData,
  validateAddressFormData,
  validateBranchFormData,
} from './data';

import styles from './CreateBranchForm.module.css';

const BRANCH_INITIAL_STATE: BranchFormData = {
  name: '',
};

const ADDRESS_PARAMS = {
  country: '',
  postcode: '',
  city: '',
  streetName: '',
  houseNumber: '',
};

type Props = {
  companyId: string;
};

export function CreateBranchForm({ companyId }: Props): ReactElement {
  const { isPending, error, createBranchMutation } = useCreateBranch({
    companyId,
  });
  const { data: geocoderHints, getGeocoderData } = useGetGeocoderData();
  const [selectedBranch, setSelectedBranch] = useState(geocoderHints?.at(0));
  const [branchValues, setBranchValues] = useState(BRANCH_INITIAL_STATE);
  const [branchErrors, setBranchErrors] = useState(BRANCH_INITIAL_STATE);
  const [addressParams, setAddressParams] = useState(ADDRESS_PARAMS);
  const [addressParamsErrors, setAddressParamsErrors] =
    useState(ADDRESS_PARAMS);

  const onBranchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBranchValues({ ...branchValues, [e.target.name]: e.target.value });
    setBranchErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onAddressParamsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddressParams({ ...addressParams, [e.target.name]: e.target.value });
    setAddressParamsErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const findAddressData = () => {
    if (Object.values(addressParams).every((param) => isNotEmpty(param))) {
      getGeocoderData(addressParams);
    } else {
      const cityError = isEmpty(addressParams.city) ? 'Wprowadź miasto.' : '';
      const postCodeError = isEmpty(addressParams.postcode)
        ? 'Wprowadź kod pocztowy.'
        : '';
      const streetNameError = isEmpty(addressParams.streetName)
        ? 'Wprowadź nazwe ulicy.'
        : '';
      const houseNumberError = isEmpty(addressParams.houseNumber)
        ? 'Wprowadź numer budynku.'
        : '';

      setAddressParamsErrors((state) => ({
        ...state,
        city: cityError,
        postcode: postCodeError,
        streetName: streetNameError,
        houseNumber: houseNumberError,
      }));
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const selectedHint = geocoderHints?.find(
      (hint) => hint.id === selectedBranch?.id
    );

    if (isNil(selectedHint)) return;

    const address = omit(['id'], selectedHint?.address);

    const addressValidationErrors = validateAddressFormData(address);
    const branchValidationErrors = validateBranchFormData(branchValues);

    if (addressValidationErrors) {
      setAddressParamsErrors(addressValidationErrors);
    }

    if (branchValidationErrors) {
      setBranchErrors(branchValidationErrors);
    }

    if (isNil(addressValidationErrors) && isNil(branchValidationErrors)) {
      createBranchMutation({
        name: branchValues.name,
        address,
      });
    }
  };

  return (
    <section className={styles.section}>
      <h3>Dodaj oddział</h3>
      <Hr />
      <form onSubmit={onSubmit}>
        <div className={styles.inputs}>
          <BaseInput
            inputSize="small"
            onChange={onBranchChange}
            value={branchValues.name}
            error={branchErrors.name}
            {...BRANCH_FIELD}
            className={styles.oneRow}
          />

          {ADDRESS_SEARCH_PARAMS_FIELDS.map((input) => (
            <BaseInput
              inputSize="small"
              key={input.name}
              {...input}
              onChange={onAddressParamsChange}
              value={addressParams[input.name]}
              error={addressParamsErrors[input.name]}
            />
          ))}

          <BaseButton
            size="medium"
            color="blue"
            type="button"
            className={styles.button}
            disabled={isPending}
            onClick={findAddressData}
          >
            Szukaj adresu
          </BaseButton>
        </div>
        <div>
          <BranchMap
            currentBranch={selectedBranch}
            branches={geocoderHints || []}
          />
          {geocoderHints && (
            <BranchList
              companyId={companyId}
              branches={geocoderHints || []}
              selectedBranchId={selectedBranch?.id}
              changeBranch={setSelectedBranch}
            />
          )}
        </div>
        <div className={styles.message}>
          {error && <p>{getErrorMessages(error)}</p>}
        </div>
        <div className={styles.controls}>
          {selectedBranch && (
            <BaseButton
              size="medium"
              color="green"
              type="submit"
              className={styles.button}
              disabled={isPending}
            >
              Stwórz oddział
            </BaseButton>
          )}
        </div>
      </form>
    </section>
  );
}
