import type { ReactElement } from 'react';

import { CompanyApplicatio } from '@Components/base';
import { LogoSpinner, Pagination } from '@Components/shared';
import { useGetOfferApplications } from '@Data/query/application';
import { usePagination } from '@Hooks/index';

import styles from './CompanyApplicationList.module.css';

type Props = { offerId: number };

export function CompanyApplicatioList({ offerId }: Props): ReactElement {
  const { pageNumber, limit, changePage } = usePagination();
  const { isLoading, applications, error, currentPage, totalPages } =
    useGetOfferApplications({
      offerId,
      params: { pageNumber, limit },
    });

  const handlePage = (page: number) => {
    changePage(page);
  };

  const showPagination = !!applications?.length;
  const showBottomPagination = applications ? applications.length > 7 : false;

  return (
    <section className={styles.section}>
      {isLoading && <LogoSpinner size="small" />}

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onSetPage={handlePage}
          classNames={styles.topPagination}
        />
      )}
      <div className={styles.list}>
        {applications &&
          applications.map((app) => (
            <CompanyApplicatio key={app.id} {...app} />
          ))}

        {applications?.length === 0 && (
          <div className={styles.emptyList}>
            <p>Brak zgłoszeń</p>
          </div>
        )}
        {error && !applications && (
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
          classNames={styles.bottomPagination}
        />
      )}
    </section>
  );
}
