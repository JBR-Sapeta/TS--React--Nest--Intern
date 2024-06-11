import { ErrorLog } from './types';
import styles from './erroritem.module.css';

const getLabel = (type: string | null) => {
  if (type === 'ForbiddenException') return `ID  urzytkownika: `;
  if (type === 'FileOperation') return `Klucz  Pliku: `;
  if (type === 'Standard') return `Kod Błędu: `;
  return '';
};

function ErrorItem({ context, type, message, count, data }: ErrorLog) {
  const label = getLabel(type);
  return (
    <div className={styles.container}>
      <div className={styles.dataBlock}>
        <p className={styles.bold}>Miejsce zgłoszenia błedu: </p>
        <span className={styles.std}> {context}</span>
      </div>

      {data && (
        <div className={styles.dataBlock}>
          <p className={styles.bold}>{label}</p>
          <p className={styles.std}>{data}</p>
        </div>
      )}

      <div className={styles.dataBlock}>
        <p className={styles.bold}>Liczba wystąpień: </p>
        <p className={styles.std}>{count}</p>
      </div>

      <div className={styles.msg}>
        <p className={styles.msgHeader}>Wiadomośc:</p>
        <hr className={styles.hr} />
        <p className={styles.msg}>{message}</p>
      </div>
    </div>
  );
}

export default ErrorItem;
