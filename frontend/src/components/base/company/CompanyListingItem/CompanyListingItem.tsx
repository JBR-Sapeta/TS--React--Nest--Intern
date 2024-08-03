import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import { CategoryTag } from '@Components/base/category';
import { CompanyLogo } from '@Components/base/company';
import { CompanyPrewiev } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import styles from './CompanyListingItem.module.css';

type Props = CompanyPrewiev;

export function CompanyListingItem({
  name: companyName,
  slug,
  size,
  logoUrl,
  locations,
  categories,
}: Props): ReactElement {
  const locationsText =
    locations.length > 3
      ? `${locations.slice(0, 3).join(',')}, +${locations.length - 3}`
      : locations.join(',');

  const showTagSlice = categories.length > 6;
  const tagsSlice = showTagSlice ? categories.slice(0, 6) : categories;

  return (
    <Link to={`${ROUTER_PATHS.COMPANIES}/${slug}`} className={styles.article}>
      <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />

      <div className={styles.dataContainer}>
        <div className={styles.header}>
          <h3>{companyName}</h3>
        </div>

        <div className={styles.info}>
          <p className={styles.p}>
            <FaUsers /> Liczba pracowników: <span>~ {size}</span>
          </p>
          <p className={styles.p}>
            <FaLocationDot /> Lokalizacje:<span>{locationsText}</span>
          </p>
        </div>

        <div className={styles.categories}>
          {tagsSlice.map(({ id, name }) => (
            <CategoryTag key={id} name={name} />
          ))}
          {showTagSlice && <CategoryTag name={`+  ${categories.length - 6}`} />}
        </div>
      </div>
    </Link>
  );
}
