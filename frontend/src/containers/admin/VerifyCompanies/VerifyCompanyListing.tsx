import { useState } from 'react';
import type { ReactElement } from 'react';

import { removeEmptyValues } from '@Common/functions';
import { CompanySearchParams, VerifyCompanyItem } from '@Components/base';
import { LogoSpinner, Pagination } from '@Components/shared';
import { useGetCompanies } from '@Data/query/admin';
import { useAdminCompanySearchParams, usePagination } from '@Hooks/index';

import styles from './VerifyCompanyListing.module.css';

export function VerifyCompanyListing(): ReactElement {
  const { pageNumber, limit, changePage } = usePagination();
  const { values, ...functions } = useAdminCompanySearchParams();
  const [params, setParams] = useState(values);
  const { isLoading, companies, error, currentPage, totalPages } =
    useGetCompanies({
      params: { pageNumber, limit, ...removeEmptyValues(params) },
    });

  const handlePage = (page: number) => {
    changePage(page);
  };

  const showPagination = !!companies?.length;
  const showBottomPagination = companies ? companies.length > 7 : false;

  return (
    <section className={styles.section}>
      <CompanySearchParams
        {...functions}
        values={values}
        setParams={setParams}
      />

      {isLoading && <LogoSpinner size="small" />}

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onSetPage={handlePage}
        />
      )}

      <div className={styles.list}>
        {companies &&
          companies.map((com) => <VerifyCompanyItem key={com.id} {...com} />)}

        {companies?.length === 0 && (
          <div className={styles.emptyList}>
            <p>Brak zgłoszeń</p>
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
