import { useState } from 'react';
import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { PiMountainsFill } from 'react-icons/pi';
import { MdLocationOn, MdMyLocation } from 'react-icons/md';
import { FaArrowsAltH } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';

import { RANGE_OPTIONS, REGION_OPTIONS } from '@Common/constants';
import { Coords, Optional } from '@Common/types';
import { BaseInput, CheckboxInput, SelectInput } from '@Components/shared';
import type { UseOfferSearchParams } from '@Hooks/index';

import styles from './LocationSearchParams.module.css';

type Props = Omit<
  UseOfferSearchParams,
  'setCategoriesParam' | 'changeSearchParams' | 'offerParams'
> & {
  setUserLocation: Dispatch<SetStateAction<Optional<Coords>>>;
};

// @ TO DO - unify with CompanySearchParams

export function LocationSearchParams({
  values,
  locationParams: {
    setCityParam,
    setLatParam,
    setLongParam,
    setRangeParam,
    setRegionParam,
    changeCity,
    changeRegion,
    changeRange,
  },
  setUserLocation,
}: Props): ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const [shareLocation, setShareLocation] = useState(
    Boolean(values.lat.length && values.long.length && values.range.length)
  );

  const getLocation = () => {
    if (navigator.geolocation) {
      if (!shareLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCityParam('');
            setRegionParam('');
            setRangeParam('5');
            setLatParam(`${latitude}`);
            setLongParam(`${longitude}`);
            setShareLocation(true);
            setUserLocation([latitude, longitude]);
          },
          (error) => {
            enqueueSnackbar({ message: error.message, variant: 'error' });
          }
        );
      } else {
        setRangeParam('');
        setLatParam('');
        setLongParam('');
        setShareLocation(false);
        setUserLocation(undefined);
      }
    } else {
      enqueueSnackbar({
        message: 'Twoja przeglądarka nie wspiera geolokalizacji.',
        variant: 'error',
      });
    }
  };

  return (
    <div className={styles.inputs}>
      <SelectInput
        name="region"
        label={{ id: '1-region', text: 'Województwo' }}
        Icon={PiMountainsFill}
        value={values.region}
        onChange={changeRegion}
        options={REGION_OPTIONS}
        className={styles.region}
        disabled={shareLocation}
      />
      <BaseInput
        type="text"
        inputSize="small"
        name="city"
        label={{ id: '2-city', text: 'Miasto' }}
        Icon={MdLocationOn}
        value={values.city}
        onChange={changeCity}
        className={styles.city}
        disabled={shareLocation}
      />
      <SelectInput
        name="range"
        label={{ id: '3-range', text: 'Odległość' }}
        Icon={FaArrowsAltH}
        value={values.range}
        onChange={changeRange}
        options={RANGE_OPTIONS}
        className={styles.range}
        disabled={!shareLocation}
      />

      <div className={styles.checkbox}>
        <span className={clsx(styles.span, { [styles.active]: shareLocation })}>
          <MdMyLocation /> Moja lokalizacja
        </span>
        <CheckboxInput
          name="location"
          label={{ id: '4-location', text: 'Udostępnij' }}
          value={shareLocation}
          onChange={getLocation}
          className={styles.location}
        />
      </div>
    </div>
  );
}
