/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { BsUpload } from 'react-icons/bs';
import { IoMdDocument } from 'react-icons/io';

import type { Nullable } from '@Common/types';
import { CompanyLogo } from '@Components/base';
import { BaseButton, Hr, Textarea } from '@Components/shared';
import { extractValidationError } from '@Data/utils';
import { useCreateApplication } from '@Data/query/application';
import { CreateApplicationError } from '@Data/types';

import styles from './CreateApplicationForm.module.css';

const INITIAL_ERROR_STATE = {
  message: '',
  file: '',
};

type Props = {
  title: string;
  position: string;
  companyName: string;
  logoUrl: Nullable<string>;
  offerId: number;
  closeModal: () => void;
};

export function CreateApplicationForm({
  title,
  position,
  companyName,
  logoUrl,
  offerId,
  closeModal,
}: Props): ReactElement {
  const { data, isPending, error, createApplicationMutation } =
    useCreateApplication({
      offerId,
    });
  const [messageValue, setMessageValue] = useState<string>('');
  const [applicationFile, setApplicationFile] = useState<File | null>(null);

  const applicationFileHandler = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.files) {
      const [file] = event.currentTarget.files;
      setApplicationFile(file);
    }
  };

  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageValue(e.target.value);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (applicationFile) {
      createApplicationMutation({
        file: applicationFile,
        message: messageValue,
      });
    }
  };

  const validationErrors = extractValidationError<CreateApplicationError>(
    INITIAL_ERROR_STATE,
    error
  );

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.offerInfo}>
        <div className={styles.infoContainer}>
          <CompanyLogo type="small" url={logoUrl} hasPadding hasRadius />
          <div className={styles.info}>
            <h3>{title}</h3>
            <p>
              Stanowisko:<span>{position}</span>
            </p>
            <p>
              Firma: <span>{companyName}</span>
            </p>
          </div>
        </div>
        <Hr className={styles.hr} />
      </div>

      <div className={styles.inputs}>
        <Textarea
          name="message"
          inputSize="small"
          label={{
            id: '1-message',
            text: 'Dodatkowe informacje lub pytania do rekrutera.',
          }}
          value={messageValue}
          error={validationErrors.message}
          Icon={FaInfoCircle}
          onChange={onMessageChange}
          className={styles.textarea}
        />

        <div className={styles.file}>
          <p>
            <IoMdDocument />
            Prześlij CV *
          </p>
          <label htmlFor="cvFile">
            <BsUpload /> Dodaj plik: <b>{applicationFile?.name}</b>
          </label>
          <input
            name="file"
            id="cvFile"
            type="file"
            onChange={applicationFileHandler}
          />
          <p>
            {validationErrors.file ? (
              <span className={styles.error}>{validationErrors.file}</span>
            ) : (
              <span>Obsługiwane formaty: PDF</span>
            )}
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <BaseButton
          color="green"
          size="medium"
          type="submit"
          disabled={isPending || !!data}
        >
          Aplikuj
        </BaseButton>
        <BaseButton
          color="plain"
          size="medium"
          type="submit"
          disabled={isPending}
          onClick={closeModal}
        >
          {data ? 'Zamknij' : 'Cofnij'}
        </BaseButton>
      </div>
    </form>
  );
}
