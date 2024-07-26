import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { BsFileTextFill, BsFillGrid3X3GapFill } from 'react-icons/bs';

import { isNil } from 'ramda';

import { BaseButton, BaseInput, Hr, Textarea } from '@Components/shared';
import { SelectCategory } from '@Containers/category';
import type {
  CategoryPreview,
  FullCompanyData,
  UpdateCompanyError,
} from '@Data/types';
import { extractValidationError } from '@Data/utils';
import { useUpdateCompany } from '@Data/query/company';

import styles from './UpdateCompanyForm.module.css';
import { FORM_FIELDS, validateFormData } from './data';

const INITIAL_ERROR_STATE: UpdateCompanyError = {
  name: '',
  slug: '',
  email: '',
  description: '',
  size: '',
  categories: '',
};

type Props = Omit<
  FullCompanyData,
  'logoUrl' | 'mainPhotoUrl' | 'isVerified' | 'createdAt' | 'Branches'
>;

export function UpdateCompanyForm({
  id,
  name,
  slug,
  size,
  email,
  description,
  categories,
}: Props): ReactElement {
  const { isPending, error, updateCompanyMutation } = useUpdateCompany({
    companyId: id,
  });
  const [values, setValues] = useState({
    name,
    slug,
    size: String(size),
    email,
    description,
    categories: [],
  });
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [selectedCategories, setSelectedCategories] =
    useState<CategoryPreview[]>(categories);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors((state) => ({ ...state, [e.target.name]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const categoriesIds = selectedCategories.map((val) => val.id);
    const formdata = {
      ...values,
      categories: categoriesIds,
      size: +values.size,
    };

    const validationErrors = validateFormData(formdata);

    if (isNil(validationErrors)) {
      updateCompanyMutation(formdata);
    } else {
      setErrors(validationErrors);
    }
  };

  const validationErrors = extractValidationError<UpdateCompanyError>(
    INITIAL_ERROR_STATE,
    error
  );

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.container}>
        <h2>Konto Firmowe</h2>
        <Hr />
        <div className={styles.inputs}>
          {FORM_FIELDS.map((input) => (
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
      </div>
      <div className={styles.container}>
        <h3>
          <BsFillGrid3X3GapFill />
          Kategorie
        </h3>
        <SelectCategory
          selectCategory={setSelectedCategories}
          selectedCategories={selectedCategories}
          errorMessage={errors.categories}
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
