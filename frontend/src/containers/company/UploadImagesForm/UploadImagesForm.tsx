/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { MdCloudUpload } from 'react-icons/md';

import { convertFileToBase64 } from '@Common/functions';
import { PicturePreview, VerifiedLabel } from '@Components/base';
import { BaseButton } from '@Components/shared';
import { getErrorMessages } from '@Data/utils';
import type { FullCompanyData } from '@Data/types';
import { useUploadCompanyImages } from '@Data/query/company';

import styles from './UploadImagesForm.module.css';

type Props = FullCompanyData;

export function UploadImagesForm({
  id,
  name,
  logoUrl,
  mainPhotoUrl,
  isVerified,
}: Props): ReactElement {
  const { isPending, error, uploadCompanyImagesMutation } =
    useUploadCompanyImages({ companyId: id });
  const [logoValue, setLogoValue] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainPhotoValue, setMainPhotoValue] = useState<string>('');
  const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null);

  const logoFileHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const [file] = event.currentTarget.files;
      const base64 = await convertFileToBase64(file);
      if (typeof base64 === 'string') {
        setLogoValue(base64);
        setLogoFile(file);
      }
    }
  };

  const mainPhotoFileHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const [file] = event.currentTarget.files;
      const base64 = await convertFileToBase64(file);
      if (typeof base64 === 'string') {
        setMainPhotoValue(base64);
        setMainPhotoFile(file);
      }
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (logoFile || mainPhotoFile) {
      uploadCompanyImagesMutation({ logoFile, mainPhotoFile });
    }
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.mainPhoto}>
        <PicturePreview
          image={mainPhotoUrl || '/company-main.png'}
          src={mainPhotoValue}
          alt="Głowne zdjęcie"
          width="100%"
          height="320px"
        />
        <div className={styles.companyLogo}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <PicturePreview
                image={logoUrl || '/company-main.png'}
                src={logoValue}
                alt="Głowne zdjęcie"
                width="96px"
                height="96px"
              />
            </div>
            <div className={styles.nameContainer}>
              <h2>{name}</h2>
            </div>
          </div>
          <VerifiedLabel isVerified={isVerified} />
        </div>
      </div>

      <div className={styles.logoPreviews}>
        <div className={styles.logoPreview}>
          <h4>Duże logo</h4>
          <PicturePreview
            image={logoUrl || '/company-main.png'}
            src={logoValue}
            alt="Głowne zdjęcie"
            width="224px"
            height="224px"
          />
        </div>
        <div className={styles.logoPreview}>
          <h4>Małe logo</h4>
          <PicturePreview
            image={logoUrl || '/company-main.png'}
            src={logoValue}
            alt="Głowne zdjęcie"
            width="96px"
            height="96px"
          />
        </div>
      </div>

      <div className={styles.message}>
        {error && <p>{getErrorMessages(error)}</p>}
      </div>

      <div className={styles.controls}>
        <div className={styles.inputs}>
          <div className={styles.formImage}>
            <label htmlFor="logoImage">
              <MdCloudUpload />
              Dodaj Logo
            </label>
            <input id="logoImage" type="file" onChange={logoFileHandler} />
          </div>

          <div className={styles.formImage}>
            <label htmlFor="mainImage">
              <MdCloudUpload />
              Dodaj głowne zdjęcie
            </label>
            <input id="mainImage" type="file" onChange={mainPhotoFileHandler} />
          </div>
        </div>

        <BaseButton
          color="green"
          size="medium"
          type="submit"
          disabled={isPending}
        >
          Zapisz
        </BaseButton>
      </div>
    </form>
  );
}
