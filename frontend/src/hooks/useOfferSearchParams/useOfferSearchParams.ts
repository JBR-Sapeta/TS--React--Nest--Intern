import { isEmpty, isNotEmpty } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OfferSearchParamsState = {
  city: string;
  region: string;
  categories: string;
  long: string;
  lat: string;
  range: string;
  employmentType: string;
  operatingMode: string;
  isPaid: string;
};

export type UseOfferSearchParams = {
  values: OfferSearchParamsState;
  locationParams: {
    setCityParam: Dispatch<SetStateAction<string>>;
    setLatParam: Dispatch<SetStateAction<string>>;
    setLongParam: Dispatch<SetStateAction<string>>;
    setRangeParam: Dispatch<SetStateAction<string>>;
    setRegionParam: Dispatch<SetStateAction<string>>;
    changeCity: (e: ChangeEvent<HTMLInputElement>) => void;
    changeRange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    changeRegion: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
  };
  offerParams: {
    setEmploymentType: Dispatch<SetStateAction<string>>;
    setOperatingMode: Dispatch<SetStateAction<string>>;
    setIsPaid: Dispatch<SetStateAction<string>>;
  };
  setCategoriesParam: Dispatch<SetStateAction<string>>;
  changeSearchParams: (data: OfferSearchParamsState) => void;
};

export function useOfferSearchParams(): UseOfferSearchParams {
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCityParam] = useState<string>(
    () => searchParams.get('city') || ''
  );
  const [region, setRegionParam] = useState<string>(
    () => searchParams.get('region') || ''
  );
  const [categories, setCategoriesParam] = useState<string>(
    () => searchParams.get('categories') || ''
  );
  const [long, setLongParam] = useState<string>(
    () => searchParams.get('long') || ''
  );
  const [lat, setLatParam] = useState<string>(
    () => searchParams.get('lat') || ''
  );
  const [range, setRangeParam] = useState<string>(
    () => searchParams.get('range') || ''
  );
  const [employmentType, setEmploymentType] = useState<string>(
    () => searchParams.get('employmentType') || ''
  );
  const [operatingMode, setOperatingMode] = useState<string>(
    () => searchParams.get('operatingMode') || ''
  );
  const [isPaid, setIsPaid] = useState<string>(
    () => searchParams.get('isPaid') || ''
  );

  const changeCity = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCityParam(e.target.value);
  }, []);

  const changeRegion = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setRegionParam(e.target.value);
    },
    []
  );

  const changeRange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setRangeParam(e.target.value);
    },
    []
  );

  const changeSearchParams = useCallback(
    (data: OfferSearchParamsState) => {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' && isNotEmpty(value)) {
          searchParams.set(key, value.toString());
        }

        if (typeof value === 'string' && isEmpty(value.toString())) {
          searchParams.delete(key);
        }

        if (typeof value === 'boolean') {
          const text = value ? 'true' : 'false';
          searchParams.set(key, text);
        }
      });
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const values = useMemo(
    () => ({
      city,
      region,
      categories,
      long,
      lat,
      range,
      employmentType,
      operatingMode,
      isPaid,
    }),
    [
      city,
      region,
      categories,
      long,
      lat,
      range,
      employmentType,
      operatingMode,
      isPaid,
    ]
  );

  return {
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
    offerParams: {
      setEmploymentType,
      setIsPaid,
      setOperatingMode,
    },
    setCategoriesParam,
    changeSearchParams,
  };
}
