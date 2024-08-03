import { isEmpty, isNotEmpty } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'react-router-dom';

export type CompanySearchParamsState = {
  city: string;
  region: string;
  categories: string;
  long: string;
  lat: string;
  range: string;
};

export type UseCompanySearchParams = {
  values: CompanySearchParamsState;
  setCategoriesParam: Dispatch<SetStateAction<string>>;
  setCityParam: Dispatch<SetStateAction<string>>;
  setLongParam: Dispatch<SetStateAction<string>>;
  setLatParam: Dispatch<SetStateAction<string>>;
  setRegionParam: Dispatch<SetStateAction<string>>;
  setRangeParam: Dispatch<SetStateAction<string>>;
  changeCity: (e: ChangeEvent<HTMLInputElement>) => void;
  changeRegion: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  changeRange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;

  changeSearchParams: (data: CompanySearchParamsState) => void;
};

export function useCompanySearchParams(): UseCompanySearchParams {
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
    (data: CompanySearchParamsState) => {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' && isNotEmpty(value)) {
          searchParams.set(key, value.toString());
        }

        if (typeof value === 'string' && isEmpty(value.toString())) {
          searchParams.delete(key);
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
    }),
    [city, region, categories, long, lat, range]
  );

  return {
    values,
    setCategoriesParam,
    setCityParam,
    setLatParam,
    setLongParam,
    setRangeParam,
    setRegionParam,
    changeCity,
    changeRegion,
    changeRange,
    changeSearchParams,
  };
}
