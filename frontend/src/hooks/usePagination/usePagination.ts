import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type UsePagination = {
  pageNumber: number;
  limit: number;
  changePage: (newPage: number) => void;
  changePageLimit: (newLimit: number) => void;
};

export function usePagination(): UsePagination {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState<number>(() =>
    Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 0
  );
  const [limit, setLimit] = useState<number>(10);

  const changePage = useCallback(
    (newPage: number) => {
      searchParams.set('page', newPage.toString());
      setSearchParams(searchParams);
      setPageNumber(newPage);
    },
    [searchParams, setSearchParams]
  );

  const changePageLimit = useCallback(
    (newLimit: number) => {
      searchParams.set('limit', newLimit.toString());
      searchParams.set('page', '0');
      setSearchParams(searchParams);
      setLimit(newLimit);
      setPageNumber(0);
    },
    [searchParams, setSearchParams]
  );

  return { pageNumber, limit, changePage, changePageLimit };
}
