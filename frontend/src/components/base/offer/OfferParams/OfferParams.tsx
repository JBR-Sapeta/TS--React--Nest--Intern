import { useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';

import { CheckboxInput } from '@Components/shared';
import { UseOfferSearchParams } from '@Hooks/index';

import styles from './OfferParams.module.css';
import { EMPLOYMENT_TYPE_FORM_MAP, OPERATING_MODE_FORM_MAP } from './data';

type Props = Omit<
  UseOfferSearchParams,
  'setCategoriesParam' | 'changeSearchParams' | 'locationParams'
>;

const DEFAULT_EMPLOYMENT_TYPE_STATE = {
  employmentTypeOne: false,
  employmentTypeTwo: false,
  employmentTypeThree: false,
  employmentTypeFour: false,
  employmentTypeFive: false,
};
const DEFAULT_OPERATING_MODE_STATE = {
  operatingModeOne: false,
  operatingModeTwo: false,
  operatingModeThree: false,
};

export function OfferParams({
  values,
  offerParams: { setEmploymentType, setOperatingMode, setIsPaid },
}: Props): ReactElement {
  const [employmentTypeValue, setEmploymentTypeValue] = useState({
    employmentTypeOne: values.employmentType === '1',
    employmentTypeTwo: values.employmentType === '2',
    employmentTypeThree: values.employmentType === '3',
    employmentTypeFour: values.employmentType === '4',
    employmentTypeFive: values.employmentType === '5',
  });

  const [operatingModeValue, setOperatingModeValue] = useState({
    operatingModeOne: values.operatingMode === '1',
    operatingModeTwo: values.operatingMode === '2',
    operatingModeThree: values.operatingMode === '3',
  });

  const [isPaidValue, setIsPaidValue] = useState({
    isPaid: values.isPaid === 'true',
    isNotPaid: values.isPaid === 'false',
  });

  const onEmploymentTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmploymentTypeValue({
      ...DEFAULT_EMPLOYMENT_TYPE_STATE,
      [e.target.name]: e.target.checked,
    });

    if (e.target.checked) {
      setEmploymentType(EMPLOYMENT_TYPE_FORM_MAP.get(e.target.name) || '');
    } else {
      setEmploymentType('');
    }
  };

  const onOperatingModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOperatingModeValue({
      ...DEFAULT_OPERATING_MODE_STATE,
      [e.target.name]: e.target.checked,
    });

    if (e.target.checked) {
      setOperatingMode(OPERATING_MODE_FORM_MAP.get(e.target.name) || '');
    } else {
      setOperatingMode('');
    }
  };

  const onIsPaidChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newState = { ...isPaidValue, [e.target.name]: e.target.checked };

    if (
      (newState.isPaid && newState.isNotPaid) ||
      (!newState.isPaid && !newState.isNotPaid)
    ) {
      setIsPaidValue(newState);
      setIsPaid('');
      return;
    }

    if (e.target.checked) {
      setIsPaidValue(newState);
      setIsPaid(e.target.name === 'isPaid' ? 'true' : 'false');
    }

    if (!e.target.checked) {
      setIsPaidValue(newState);
      setIsPaid('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputs}>
        <p>Wynagrodzenie</p>
        <CheckboxInput
          name="isPaid"
          label={{ id: 'isPaid-true', text: 'Płatne' }}
          value={isPaidValue.isPaid}
          onChange={onIsPaidChange}
          className={styles.location}
        />
        <CheckboxInput
          name="isNotPaid"
          label={{ id: 'isPaid-false', text: 'Bezpłatne' }}
          value={isPaidValue.isNotPaid}
          onChange={onIsPaidChange}
          className={styles.location}
        />
      </div>
      <div className={styles.inputs}>
        <p>Rodzaj zatrudnienie</p>
        <CheckboxInput
          name="employmentTypeOne"
          label={{ id: 'employmentType-1', text: 'Staż' }}
          value={employmentTypeValue.employmentTypeOne}
          onChange={onEmploymentTypeChange}
          className={styles.location}
        />
        <CheckboxInput
          name="employmentTypeTwo"
          label={{ id: 'employmentType-2', text: 'Praktyki' }}
          value={employmentTypeValue.employmentTypeTwo}
          onChange={onEmploymentTypeChange}
          className={styles.location}
        />
        <CheckboxInput
          name="employmentTypeThree"
          label={{ id: 'employmentType-3', text: 'Praktyki zawodowe' }}
          value={employmentTypeValue.employmentTypeThree}
          onChange={onEmploymentTypeChange}
          className={styles.location}
        />
        <CheckboxInput
          name="employmentTypeFour"
          label={{ id: 'employmentType-4', text: 'Praca w weekendy' }}
          value={employmentTypeValue.employmentTypeFour}
          onChange={onEmploymentTypeChange}
          className={styles.location}
        />
        <CheckboxInput
          name="employmentTypeFive"
          label={{ id: 'employmentType-5', text: 'Praca w wakacje' }}
          value={employmentTypeValue.employmentTypeFive}
          onChange={onEmploymentTypeChange}
          className={styles.location}
        />
      </div>
      <div className={styles.inputs}>
        <p>Tryb Pracy</p>
        <CheckboxInput
          name="operatingModeOne"
          label={{ id: 'operatingMode-1', text: 'Stacjonarny' }}
          value={operatingModeValue.operatingModeOne}
          onChange={onOperatingModeChange}
          className={styles.location}
        />
        <CheckboxInput
          name="operatingModeTwo"
          label={{ id: 'operatingMode-2', text: 'Zdalny' }}
          value={operatingModeValue.operatingModeTwo}
          onChange={onOperatingModeChange}
          className={styles.location}
        />
        <CheckboxInput
          name="operatingModeThree"
          label={{ id: 'operatingMode-3', text: 'Hybrydowy' }}
          value={operatingModeValue.operatingModeThree}
          onChange={onOperatingModeChange}
          className={styles.location}
        />
      </div>
    </div>
  );
}
