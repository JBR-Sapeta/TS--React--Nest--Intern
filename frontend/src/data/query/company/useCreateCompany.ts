import { useNavigate } from 'react-router-dom';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import { Nullable, Optional } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  CreateCompanyBody,
  CreateCompanyError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function createCompany(
  body: CreateCompanyBody,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }
  const { data } = await axios.post<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/companies/create`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseCreateCompany = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<ValidationError<CreateCompanyError> | BaseError>>;
  createCompanyMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateCompanyError> | BaseError>,
    CreateCompanyBody,
    unknown
  >;
};

export function useCreateCompany(): UseCreateCompany {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: createCompanyMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateCompanyError> | BaseError>,
    CreateCompanyBody,
    unknown
  >({
    mutationFn: (body) => createCompany(body, accessToken),
    onSuccess: (res) => {
      if (res) {
        enqueueSnackbar({
          message: res.message,
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_PROFILE] });
        queryClient
          .invalidateQueries({ queryKey: [QUERY_KEY.ACCESS_TOKEN] })
          .finally(() => {
            navigate(ROUTER_PATHS.COMPANY_VIEW);
          });
      }
    },
    onError: (res) => {
      enqueueSnackbar({
        message: getErrorMessages(res),
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, createCompanyMutation };
}
