import { isEmpty, isNotEmpty } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

export type AdminCompanySearchParamsState = {
  name: string;
  slug: string;
  email: string;
  owner: boolean;
  isVerified: boolean;
};

export type UseAdminCompanySearchParams = {
  values: AdminCompanySearchParamsState;
  changeName: (e: ChangeEvent<HTMLInputElement>) => void;
  changeSlug: (e: ChangeEvent<HTMLInputElement>) => void;
  changeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  changeOwner: (e: ChangeEvent<HTMLInputElement>) => void;
  changeIsVerified: (e: ChangeEvent<HTMLInputElement>) => void;
  changeSearchParams: (data: AdminCompanySearchParamsState) => void;
};

export function useAdminCompanySearchParams(): UseAdminCompanySearchParams {
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState<string>(
    () => searchParams.get('name') || ''
  );
  const [slug, setSlug] = useState<string>(
    () => searchParams.get('slug') || ''
  );
  const [email, setEmail] = useState<string>(
    () => searchParams.get('email') || ''
  );
  const [owner, setOwner] = useState<boolean>(
    () => searchParams.get('owner') === 'true'
  );
  const [isVerified, setIsVerified] = useState<boolean>(
    () => searchParams.get('isVerified') === 'true'
  );

  const changeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const changeSlug = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  }, []);

  const changeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const changeOwner = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.checked);
  }, []);

  const changeIsVerified = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsVerified(e.target.checked);
  }, []);

  const changeSearchParams = useCallback(
    (data: AdminCompanySearchParamsState) => {
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
      name,
      slug,
      email,
      owner,
      isVerified,
    }),
    [name, slug, email, owner, isVerified]
  );

  return {
    values,
    changeName,
    changeSlug,
    changeEmail,
    changeOwner,
    changeIsVerified,
    changeSearchParams,
  };
}
