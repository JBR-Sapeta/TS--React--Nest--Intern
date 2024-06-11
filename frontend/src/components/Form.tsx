/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './form.module.css';
import { ErrorLogs, ErrorLogsBucketResponse, HttpError } from './types';

function getError(error: HttpError) {
  if (typeof error.message === 'string') {
    return error.message;
  }

  const messages: string[] = [];

  Object.values(error.message).forEach((msg) => messages.push(msg));

  return messages.join(' ');
}

function RaportForm({
  setData,
}: {
  setData: (data: ErrorLogs | null) => void;
}) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const handleStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const params = [];

    if (startDate) {
      params.push(`startDate=${startDate}`);
    }

    if (endDate) {
      params.push(`endDate=${endDate}`);
    }

    setIsloading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/logs?${params.join('&')}`
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(`${getError(errorData)}`);
      }

      const result = (await response.json()) as ErrorLogsBucketResponse;

      setData(result.data);
      setError(null);
      setIsloading(false);
    } catch (e: any) {
      setError(e.message);
      setData(null);
      setIsloading(false);
    }
  };

  return (
    <>
      <h3>Raport błędów serwera</h3>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.formBorder}>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <label htmlFor="startDate">Data początkowa</label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={handleStartDate}
              />
            </div>
            <button
              className={styles.blueButton}
              type="button"
              onClick={() => setStartDate('')}
            >
              Resetuj
            </button>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.input}>
              <label htmlFor="endDate">Data końcowa</label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={handleEndDate}
              />
            </div>
            <button
              className={styles.blueButton}
              type="button"
              onClick={() => setEndDate('')}
            >
              Resetuj
            </button>
          </div>
        </div>
        <button
          className={styles.greenButton}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Pobieranie...' : 'Pobierz raport'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <hr className={styles.hr} />
    </>
  );
}

export default RaportForm;
