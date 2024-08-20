import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { isEmpty, isNil, isNotEmpty, omit } from 'ramda';

import { BranchMap } from '@Components/base';
import { BaseButton, BaseInput, Hr } from '@Components/shared';
import { getErrorMessages } from '@Data/utils';
import { Branch } from '@Data/types';
import { useGetGeocoderData, useUpdateBranch } from '@Data/query/branch';

import { BranchList } from '../BranchList/BranchList';

import {
  ADDRESS_SEARCH_PARAMS_FIELDS,
  BRANCH_FIELD,
  BranchFormData,
  validateAddressFormData,
  validateBranchFormData,
} from './data';

import styles from './UpdateBranchForm.module.css';

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
  branch: Branch;
};

export function UpdateBranchForm({ branch, companyId }: Props): ReactElement {
  const { id: branchId, name, address } = branch;
  const addressData = omit(['id'], {
    ...address,
    lat: String(address.lat),
    long: String(address.long),
  });
  const { isPending, error, updateBranchMutation } = useUpdateBranch({
    companyId,
    branchId,
  });
  const { data: geocoderHints, getGeocoderData } = useGetGeocoderData();
  const [selectedBranch, setSelectedBranch] = useState(geocoderHints?.at(0));
  const [branchValues, setBranchValues] = useState({ name });
  const [branchErrors, setBranchErrors] = useState(BRANCH_INITIAL_STATE);
  const [addressParams, setAddressParams] = useState(addressData);
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

    const newAddress = selectedHint?.address;

    const addressValidationErrors = validateAddressFormData(
      newAddress || address
    );
    const branchValidationErrors = validateBranchFormData(branchValues);

    if (addressValidationErrors) {
      setAddressParamsErrors(addressValidationErrors);
    }

    if (branchValidationErrors) {
      setBranchErrors(branchValidationErrors);
    }

    if (isNil(addressValidationErrors) && isNil(branchValidationErrors)) {
      updateBranchMutation({
        name: branchValues.name,
        address: newAddress,
      });
    }
  };
  return (
    <section className={styles.section}>
      <h3>Zaktualizuj oddział</h3>
      <Hr />
      <form onSubmit={onSubmit}>
        <div className={styles.inputs}>
          <BaseInput
            inputSize="small"
            onChange={onBranchChange}
            value={branchValues.name}
            error={branchErrors.name}
            {...BRANCH_FIELD}
            className={styles.companyName}
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
        </div>
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
        <div className={styles.message}>
          {error && <p>{getErrorMessages(error)}</p>}
        </div>
        <div>
          <BranchMap
            currentBranch={selectedBranch}
            branches={geocoderHints || []}
          />
          <BranchList
            companyId={companyId}
            branches={geocoderHints || []}
            selectedBranchId={selectedBranch?.id}
            changeBranch={setSelectedBranch}
          />
        </div>
        <BaseButton
          size="medium"
          color="green"
          type="submit"
          className={styles.button}
          disabled={isPending}
        >
          Zaktualizuj
        </BaseButton>
      </form>
    </section>
  );
}
