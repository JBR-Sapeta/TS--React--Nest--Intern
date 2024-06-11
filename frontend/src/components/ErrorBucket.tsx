/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import { ErrorLogsBucket } from './types';
import ErrorItem from './ErrorItem';
import styles from './errorbucket.module.css';

const SHOW_ERRORS = { standard: false, forbidden: false, file: false };

function ErrorBucket({
  name,
  standardErrorsCount,
  forbiddenErrorsCount,
  fileErrorsCount,
  standardErrors,
  forbiddenErrors,
  fileErrors,
}: ErrorLogsBucket) {
  const [showErrors, setShowErrors] = useState({ ...SHOW_ERRORS });

  const showErrorsTabel = (
    key: 'standard' | 'forbidden' | 'file' | 'reset'
  ) => {
    if (key === 'reset') {
      setShowErrors({ ...SHOW_ERRORS });
    } else {
      setShowErrors({ ...SHOW_ERRORS, [key]: true });
    }
  };

  const showForbbidenErrorss = fileErrorsCount > 0;

  const isTabOpen =
    showErrors.file || showErrors.forbidden || showErrors.standard;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>
          {name} -{' '}
          {standardErrorsCount + forbiddenErrorsCount + fileErrorsCount}
        </h4>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.errorsCount}>
          <p>Standardowe błędy: {standardErrorsCount}</p>
          <p>Nieautoryzowane dostęp: {forbiddenErrorsCount}</p>
          {showForbbidenErrorss && (
            <p>Operacje na plikach: {fileErrorsCount}</p>
          )}
        </div>
        <div className={styles.controls}>
          <button
            className={styles.orangeButton}
            type="button"
            onClick={() => showErrorsTabel('standard')}
          >
            Lista standardowych błędów
          </button>
          <button
            className={styles.orangeButton}
            type="button"
            onClick={() => showErrorsTabel('forbidden')}
          >
            Lista nieautoryzowanych błędów
          </button>
          {showForbbidenErrorss && (
            <button
              className={styles.orangeButton}
              type="button"
              onClick={() => showErrorsTabel('file')}
            >
              Lista błędnych operacji na plikach
            </button>
          )}
          {isTabOpen && (
            <button
              className={styles.redButton}
              type="button"
              onClick={() => showErrorsTabel('reset')}
            >
              Zamknij
            </button>
          )}
        </div>
        <div className={styles.messages}>
          {showErrors.standard &&
            (standardErrorsCount > 0 ? (
              standardErrors.map((error, i) => (
                <ErrorItem key={`std-${i}`} {...error} />
              ))
            ) : (
              <p className={styles.emptyState}>Brak błędów</p>
            ))}
          {showErrors.forbidden &&
            (forbiddenErrorsCount > 0 ? (
              forbiddenErrors.map((error, i) => (
                <ErrorItem key={`for-${i}`} {...error} />
              ))
            ) : (
              <p className={styles.emptyState}>Brak błędów</p>
            ))}
          {showErrors.file &&
            (fileErrorsCount > 0 ? (
              fileErrors.map((error, i) => (
                <ErrorItem key={`file-${i}`} {...error} />
              ))
            ) : (
              <p className={styles.emptyState}>Brak błędów</p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ErrorBucket;
