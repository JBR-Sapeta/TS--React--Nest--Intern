import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { MdSearch } from 'react-icons/md';

import { removeEmptyValues } from '@Common/functions';
import { Coords, Optional } from '@Common/types';
import {
  CompaniesMap,
  CompanyListingItem,
  CompanySearchParams,
} from '@Components/base';
import { BaseButton, LogoSpinner, Pagination } from '@Components/shared';
import { SelectCategory } from '@Containers/category';
import { useGetCompanies } from '@Data/query/company';
import { CategoryPreview } from '@Data/types';
import { useCompanySearchParams, usePagination } from '@Hooks/index';

import styles from './CompanyListing.module.css';

export function CompanyListing(): ReactElement {
  const [userLocation, setUserLocation] = useState<Optional<Coords>>();
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryPreview[]
  >([]);
  const { pageNumber, limit, changePage } = usePagination();
  const { values, changeSearchParams, ...functions } = useCompanySearchParams();
  const [params, setParams] = useState(values);
  const { isLoading, companies, error, currentPage, totalPages } =
    useGetCompanies({
      params: {
        pageNumber,
        limit,
        ...removeEmptyValues(params),
      },
    });

  const handlePage = (page: number) => {
    changePage(page);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const categoriesParam = selectedCategories.map((cat) => cat.id).join(',');
    const newParams = { ...values, categories: categoriesParam };
    changeSearchParams(newParams);
    setParams(newParams);
  };

  const showPagination = !!companies?.length;
  const showBottomPagination = companies ? companies.length > 6 : false;

  return (
    <section className={styles.section}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.map}>
          <CompaniesMap userLocation={userLocation} />
          <CompanySearchParams
            values={values}
            {...functions}
            setUserLocation={setUserLocation}
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
          />
          <BaseButton
            type="submit"
            size="medium"
            color="green"
            LeftIcon={MdSearch}
          >
            Szukaj
          </BaseButton>
        </div>
      </form>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onSetPage={handlePage}
          showPages
        />
      )}
      <div className={styles.list}>
        {isLoading && <LogoSpinner size="small" />}
        {companies &&
          companies.map((company) => (
            <CompanyListingItem key={company.id} {...company} />
          ))}

        {companies?.length === 0 && (
          <div className={styles.emptyList}>
            <p>Brak wyników</p>
          </div>
        )}
        {error && !companies && (
          <div className={styles.emptyList}>
            <p>{error.message}</p>
          </div>
        )}
      </div>
      {showBottomPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onSetPage={handlePage}
        />
      )}
    </section>
  );
}
