import clsx from 'clsx';

import styles from './Pagination.module.css';

type Props = {
  currentPage: number;
  totalPages: number;
  onSetPage: (number: number) => void;
  classNames?: string;
  showPages?: boolean;
  enableScroll?: boolean;
};

export function Pagination({
  currentPage,
  totalPages,
  onSetPage,
  classNames,
  showPages = false,
  enableScroll = false,
}: Props) {
  const changePage = (page: number) => {
    onSetPage(currentPage + page);
    if (enableScroll) {
      window.scrollTo(0, 0);
    }
  };

  const showPreviousPage = currentPage > 0;
  const showNextPage = currentPage + 1 < totalPages;

  return (
    <div className={clsx(styles.pagination, classNames)}>
      {showPages && (
        <div className={styles.paginationPageIndicator}>{`
      Strona: 
      ${currentPage + 1}/${totalPages || 1}`}</div>
      )}

      <div className={styles.paginationButtons}>
        {showPreviousPage && (
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => {
              changePage(-1);
            }}
          >
            {currentPage}
          </button>
        )}

        <button
          type="button"
          className={clsx(
            styles.paginationButton,
            styles.activePaginationButton
          )}
        >
          {currentPage + 1}
        </button>

        {showNextPage && (
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => {
              changePage(1);
            }}
          >
            {currentPage + 2}
          </button>
        )}
      </div>
      <div />
    </div>
  );
}
