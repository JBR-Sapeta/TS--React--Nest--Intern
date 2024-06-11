/* eslint-disable react/no-array-index-key */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

import RaportForm from 'src/components/Form';
import ErrorBucket from 'src/components/ErrorBucket';
import { ErrorLogs, ErrorLogsBucket } from 'src/components/types';

import styles from './app.module.css';

function App() {
  const [errorLogs, setErrorLogs] = useState<ErrorLogs | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const serviceBuckets: ErrorLogsBucket[] = [];
  const repositoryBuckets: ErrorLogsBucket[] = [];
  const otherBuckets: ErrorLogsBucket[] = [];
  const unknownExceptions: string[] = [];

  if (errorLogs) {
    errorLogs.buckets.forEach((bucket) => {
      if (bucket.name.endsWith('Service')) {
        serviceBuckets.push(bucket);
      } else if (bucket.name.endsWith('Repository')) {
        repositoryBuckets.push(bucket);
      } else {
        otherBuckets.push(bucket);
      }
    });

    errorLogs.unknownExceptions.forEach((error) => {
      if (error.length > 0) {
        unknownExceptions.push(error);
      }
    });
  }

  const toggleAll = () => {
    setShowAll((state) => !state);
  };

  const serviceErrorsCount = serviceBuckets
    .map(
      (v) => v.fileErrorsCount + v.forbiddenErrorsCount + v.standardErrorsCount
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const repositoryErrorsCount = repositoryBuckets
    .map(
      (v) => v.fileErrorsCount + v.forbiddenErrorsCount + v.standardErrorsCount
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const otherErrorsCount = otherBuckets
    .map(
      (v) => v.fileErrorsCount + v.forbiddenErrorsCount + v.standardErrorsCount
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const showServices = serviceErrorsCount > 0;
  const showRepositories = serviceErrorsCount > 0;
  const showOther = serviceErrorsCount > 0;
  const showUnknown = unknownExceptions.length > 0;
  const showSummary = showServices || showRepositories || showOther;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Intern</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.page}>
          <RaportForm setData={setErrorLogs} />
          <div className={styles.filters}>
            <p className={styles.filter}>Filtry:</p>
            <div className={styles.showAll}>
              <label htmlFor="showAll">Pokaż puste koszyki</label>
              <input
                id="showAll"
                type="checkbox"
                onChange={() => toggleAll()}
              />
            </div>
          </div>
          <div className={styles.buckets}>
            {showServices && (
              <>
                <h3>Serwisy - {serviceErrorsCount}</h3>
                <hr className={styles.hr} />
                {serviceBuckets.map((bucket) => {
                  const showBucket =
                    bucket.fileErrorsCount +
                      bucket.forbiddenErrorsCount +
                      bucket.standardErrorsCount >
                    0;

                  return showBucket || showAll ? (
                    <ErrorBucket key={bucket.name} {...bucket} />
                  ) : null;
                })}
              </>
            )}
            {showRepositories && (
              <>
                <h3>Repozytoria - {repositoryErrorsCount}</h3>
                <hr className={styles.hr} />
                {repositoryBuckets.map((bucket) => {
                  const showBucket =
                    bucket.fileErrorsCount +
                      bucket.forbiddenErrorsCount +
                      bucket.standardErrorsCount >
                    0;

                  return showBucket || showAll ? (
                    <ErrorBucket key={bucket.name} {...bucket} />
                  ) : null;
                })}
              </>
            )}
            {showOther && (
              <>
                <h3>Pozostałe - {otherErrorsCount}</h3>
                <hr className={styles.hr} />
                {otherBuckets.map((bucket) => {
                  const showBucket =
                    bucket.fileErrorsCount +
                      bucket.forbiddenErrorsCount +
                      bucket.standardErrorsCount >
                    0;

                  return showBucket || showAll ? (
                    <ErrorBucket key={bucket.name} {...bucket} />
                  ) : null;
                })}
              </>
            )}
            {showSummary ? (
              <>
                <hr className={styles.hr} />
                <h3>
                  Razem -{' '}
                  {serviceErrorsCount +
                    repositoryErrorsCount +
                    otherErrorsCount}{' '}
                </h3>
              </>
            ) : (
              <h3> Brak błedów</h3>
            )}
          </div>
          <div className={styles.buckets}>
            {showUnknown && (
              <>
                <h3>Niezidentyfikowane błędy - {unknownExceptions.length}</h3>
                <hr className={styles.hr} />
                {unknownExceptions.map((error, index) => (
                  <p className={styles.unknownError} key={index}>
                    {error}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <h2>Intern</h2>
      </footer>
    </div>
  );
}

export default App;
