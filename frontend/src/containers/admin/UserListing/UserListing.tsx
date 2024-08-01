import { useState } from 'react';
import type { ReactElement } from 'react';

import { removeEmptyValues } from '@Common/functions';
import { UserSearchParams, UserPreview } from '@Components/base';
import { LogoSpinner, Pagination } from '@Components/shared';
import { useGetUsers } from '@Data/query/admin';
import { usePagination, useUserSearchParams } from '@Hooks/index';

import styles from './UserListing.module.css';

export function UserListing(): ReactElement {
  const { pageNumber, limit, changePage } = usePagination();
  const { values, ...functions } = useUserSearchParams();
  const [params, setParams] = useState(values);
  const { isLoading, users, error, currentPage, totalPages } = useGetUsers({
    params: {
      pageNumber,
      limit,
      ...removeEmptyValues(params),
    },
  });

  const handlePage = (page: number) => {
    changePage(page);
  };

  const showPagination = !!users?.length;
  const showBottomPagination = users ? users.length > 6 : false;

  return (
    <section className={styles.section}>
      <UserSearchParams {...functions} values={values} setParams={setParams} />

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
        {users && users.map((user) => <UserPreview key={user.id} {...user} />)}

        {users?.length === 0 && (
          <div className={styles.emptyList}>
            <p>Brak wyników</p>
          </div>
        )}
        {error && !users && (
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
