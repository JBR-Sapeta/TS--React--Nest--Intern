import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { MdSearch } from 'react-icons/md';

import { removeEmptyValues } from '@Common/functions';
import { Coords, Optional } from '@Common/types';
import {
  LocationSearchParams,
  OfferListingItem,
  OfferParams,
  OffersMap,
} from '@Components/base';
import { BaseButton, Hr, LogoSpinner, Pagination } from '@Components/shared';
import { SelectCategory } from '@Containers/category';
import { useGetOffers } from '@Data/query/offer';
import { CategoryPreview } from '@Data/types';
import { useOfferSearchParams, usePagination } from '@Hooks/index';

import styles from './OfferListing.module.css';

type Props = {
  applications: number[];
};

export function OfferListing({ applications }: Props): ReactElement {
  const [userLocation, setUserLocation] = useState<Optional<Coords>>();
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryPreview[]
  >([]);
  const { pageNumber, limit, changePage } = usePagination();
  const { values, changeSearchParams, offerParams, locationParams } =
    useOfferSearchParams();
  const [params, setParams] = useState(values);
  const { isLoading, offers, error, currentPage, totalPages } = useGetOffers({
    params: {
      pageNumber,
      limit,
      ...removeEmptyValues(params),
    },
  });

  const handlePage = (page: number) => {
    changePage(page);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const categoriesParam = selectedCategories.map((cat) => cat.id).join(',');
    const newParams = { ...values, categories: categoriesParam };
    changeSearchParams(newParams);
    setParams(newParams);
  };

  const showPagination = !!offers?.length;
  const showBottomPagination = offers ? offers.length > 6 : false;

  return (
    <section className={styles.section}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.left}>
          <div className={styles.leftRow}>
            <OfferParams values={values} offerParams={offerParams} />
            <Hr className={styles.hr} />
            <BaseButton
              type="submit"
              size="medium"
              color="green"
              LeftIcon={MdSearch}
              className={styles.button}
            >
              Szukaj
            </BaseButton>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.map}>
            <OffersMap userLocation={userLocation} />
            <LocationSearchParams
              values={values}
              locationParams={locationParams}
              setUserLocation={setUserLocation}
            />
          </div>

          <div className={styles.categories}>
            <h3>
              <BsFillGrid3X3GapFill />
              Kategorie
            </h3>
            <SelectCategory
              selectCategory={setSelectedCategories}
              selectedCategories={selectedCategories}
            />
          </div>
        </div>
      </form>

      <div className={styles.list}>
        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onSetPage={handlePage}
            classNames={styles.pagination}
            showPages
          />
        )}
        {isLoading && (
          <div className={styles.spinner}>
            <LogoSpinner size="small" />
          </div>
        )}
        {offers &&
          offers.map((offer) => (
            <OfferListingItem
              key={offer.id}
              {...offer}
              hasApplication={applications.includes(offer.id)}
            />
          ))}

        {offers?.length === 0 && (
          <div className={styles.emptyList}>
            <p>Brak wyników</p>
          </div>
        )}
        {error && !offers && (
          <div className={styles.emptyList}>
            <p>{error.message}</p>
          </div>
        )}
        {showBottomPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onSetPage={handlePage}
            classNames={styles.pagination}
          />
        )}
      </div>
    </section>
  );
}
