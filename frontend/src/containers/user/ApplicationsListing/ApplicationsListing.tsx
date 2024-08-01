import type { ReactElement } from 'react';

import { ApplicationItem } from '@Components/base';
import { LogoSpinner, Pagination } from '@Components/shared';
import { useGetUserApplications } from '@Data/query/application';
import { usePagination } from '@Hooks/index';

import styles from './ApplicationsListing.module.css';

type Props = { userId: string };

export function ApplicationsListing({ userId }: Props): ReactElement {
  const { changePage, ...params } = usePagination();
  const { isLoading, applications, error, currentPage, totalPages } =
    useGetUserApplications({
      params,
      userId,
    });

  const handlePage = (page: number) => {
    changePage(page);
  };

  const showPagination = !!applications?.length;
  const showBottomPagination = applications ? applications.length > 6 : false;

  return (
    <section className={styles.section}>
      {isLoading && <LogoSpinner size="small" />}

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onSetPage={handlePage}
          showPages
        />
      )}

      <div className={styles.list}>
        {applications &&
          applications.map((app) => <ApplicationItem key={app.id} {...app} />)}

        {applications?.length === 0 && (
          <div className={styles.emptyList}>
            <p>Brak aplikacji</p>
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
        />
      )}
    </section>
  );
}
