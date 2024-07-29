import { useState } from 'react';
import type {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';
import { BsFileTextFill } from 'react-icons/bs';

import {
  BaseInput,
  CheckboxInput,
  SelectInput,
  Textarea,
} from '@Components/shared';
import { CreateOfferError } from '@Data/types';

import {
  BASE_FORM_FIELDS,
  FORM_CHECKBOX_FIELDS,
  FORM_SELECT_FIELDS,
  OfferDataFormState,
  BaseOfferDataForm,
  CreateOfferFormErrors,
} from './data';

import styles from './CreateOfferDataForm.module.css';

const BASE_INITIAL_STATE: BaseOfferDataForm = {
  title: '',
  position: '',
  expirationTime: '',
  description: '',
  employmentType: '',
  operatingMode: '',
};

type Props = {
  errors: BaseOfferDataForm;
  validationErrors: Partial<CreateOfferError>;
  setErrors: Dispatch<SetStateAction<CreateOfferFormErrors>>;
  liftState: Dispatch<SetStateAction<OfferDataFormState>>;
};

export function CreateOfferDataForm({
  errors,
  validationErrors,
  setErrors,
  liftState,
}: Props): ReactElement {
  const [isPaidValue, setIsPaidValue] = useState(false);
  const [isActiveValue, setIsActiveValue] = useState(false);
  const [values, setValues] = useState(BASE_INITIAL_STATE);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
    liftState({
      ...values,
      [e.target.name]: e.target.value,
      isPaid: isActiveValue,
      isActive: isActiveValue,
    });
  };

  const onIsPaidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPaidValue(e.target.checked);
    liftState({
      ...values,
      isPaid: e.target.checked,
      isActive: isActiveValue,
    });
  };

  const onIsActiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsActiveValue(e.target.checked);
    liftState({
      ...values,
      isPaid: isActiveValue,
      isActive: e.target.checked,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputs}>
        {BASE_FORM_FIELDS.map((input) => (
          <BaseInput
            inputSize="small"
            key={input.name}
            {...input}
            onChange={onChange}
            value={values[input.name]}
            error={errors[input.name] || validationErrors[input.name]}
            className={styles[input.name]}
          />
        ))}
        {FORM_SELECT_FIELDS.map((input) => (
          <SelectInput
            key={input.name}
            {...input}
            onChange={onChange}
            value={values[input.name]}
            error={errors[input.name] || validationErrors[input.name]}
            className={styles[input.name]}
          />
        ))}
      </div>
      <div className={styles.checkboxes}>
        <CheckboxInput
          {...FORM_CHECKBOX_FIELDS[0]}
          onChange={onIsPaidChange}
          value={isPaidValue}
        />
        <CheckboxInput
          {...FORM_CHECKBOX_FIELDS[1]}
          onChange={onIsActiveChange}
          value={isActiveValue}
        />
      </div>
      <Textarea
        inputSize="small"
        name="description"
        label={{ id: '5-description', text: 'Opis' }}
        onChange={onChange}
        Icon={BsFileTextFill}
        value={values.description}
        error={errors.description || validationErrors.description}
        className={styles.description}
      />
    </div>
  );
}
