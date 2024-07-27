import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { isNil, omit } from 'ramda';

import { BaseButton, BaseInput, Hr } from '@Components/shared';
import { getErrorMessages } from '@Data/utils';
import { Branch } from '@Data/types';
import { useUpdateBranch } from '@Data/query/branch';

import {
  ADDRESS_FORM_FIELDS,
  AddressFromData,
  BRANCH_FIELD,
  BranchFormData,
  validateAddressFormData,
  validateBranchFormData,
} from './data';

import styles from './UpdateBranchForm.module.css';

const BRANCH_INITIAL_STATE: BranchFormData = {
  name: '',
};

const ADDRESS_INITIAL_STATE: AddressFromData = {
  country: '',
  region: '',
  postcode: '',
  city: '',
  streetName: '',
  houseNumber: '',
  lat: '',
  long: '',
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
  const [branchValues, setBranchValues] = useState({ name });
  const [branchErrors, setBranchErrors] = useState(BRANCH_INITIAL_STATE);
  const [addressValues, setAddressValues] = useState(addressData);
  const [addressErrors, setAddressErrors] = useState(ADDRESS_INITIAL_STATE);

  const onBranchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBranchValues({ ...branchValues, [e.target.name]: e.target.value });
    setBranchErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddressValues({ ...addressValues, [e.target.name]: e.target.value });
    setAddressErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const addressValidationErrors = validateAddressFormData(addressValues);
    const branchValidationErrors = validateBranchFormData(branchValues);

    if (addressValidationErrors) {
      setAddressErrors(addressValidationErrors);
    }

    if (branchValidationErrors) {
      setBranchErrors(branchValidationErrors);
    }

    if (isNil(addressValidationErrors) && isNil(branchValidationErrors)) {
      updateBranchMutation({
        name: branchValues.name,
        address: {
          ...addressValues,
          lat: +addressValues.lat,
          long: +addressValues.long,
        },
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

          {ADDRESS_FORM_FIELDS.map((input) => (
            <BaseInput
              inputSize="small"
              key={input.name}
              {...input}
              onChange={onAddressChange}
              value={addressValues[input.name]}
              error={addressErrors[input.name]}
            />
          ))}
        </div>
        <div className={styles.message}>
          {error && <p>{getErrorMessages(error)}</p>}
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
