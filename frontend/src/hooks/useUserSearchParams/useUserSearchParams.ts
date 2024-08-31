import { isEmpty, isNotEmpty } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UserSearchParamsState = {
  firstName: string;
  lastName: string;
  email: string;
  hasBan: boolean;
};

export type UseUserSearchParams = {
  values: UserSearchParamsState;
  changeFirstName: (e: ChangeEvent<HTMLInputElement>) => void;
  changeLastName: (e: ChangeEvent<HTMLInputElement>) => void;
  changeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  changeHasBan: (e: ChangeEvent<HTMLInputElement>) => void;
  changeSearchParams: (data: UserSearchParamsState) => void;
};

export function useUserSearchParams(): UseUserSearchParams {
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstName, setFirstNamee] = useState<string>(
    () => searchParams.get('firstName') || ''
  );
  const [lastName, setLastName] = useState<string>(
    () => searchParams.get('lastName') || ''
  );
  const [email, setEmail] = useState<string>(
    () => searchParams.get('email') || ''
  );
  const [hasBan, setHasBan] = useState<boolean>(
    () => searchParams.get('hasBan') === 'true'
  );

  const changeFirstName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFirstNamee(e.target.value);
  }, []);

  const changeLastName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  }, []);

  const changeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const changeHasBan = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setHasBan(e.target.checked);
  }, []);

  const changeSearchParams = useCallback(
    (data: UserSearchParamsState) => {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' && isNotEmpty(value)) {
          searchParams.set(key, value);
        }

        if (typeof value === 'string' && isEmpty(value)) {
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
      firstName,
      lastName,
      email,
      hasBan,
    }),
    [firstName, lastName, email, hasBan]
  );

  return {
    values,
    changeFirstName,
    changeLastName,
    changeEmail,
    changeHasBan,
    changeSearchParams,
  };
}
