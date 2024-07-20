import { useNavigate } from 'react-router-dom';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import { HttpStatusCode } from '@Common/enums';
import { Nullable, Nullish, Optional } from '@Common/types';
import { QUERY_KEY } from '@Data/constant';
import { ROUTER_PATHS } from '@Router/constants';

import type { BaseError, BaseResponse, TokensResponse } from '../types';
import {
  getErrorMessages,
  profileDataStorage,
  tokenDataStorage,
} from '../utils';

import { useGetAccessToken } from './useGetAccessToken';

async function logout(
  accessToken: Nullish<string>
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) return undefined;

  const { data } = await axios.post<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseLogout = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<BaseError>>;
  logoutMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    null,
    unknown
  >;
};

export function useLogout(): UseLogout {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: logoutMutation,
  } = useMutation<Optional<BaseResponse>, AxiosError<BaseError>, null, unknown>(
    {
      mutationFn: () => logout(accessToken),
      onSuccess: (res) => {
        if (res?.statusCode === HttpStatusCode.OK) {
          tokenDataStorage.removeTokens();
          profileDataStorage.removeProfile();
          queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], null);
          queryClient.setQueryData([QUERY_KEY.USER_PROFILE], null);
          enqueueSnackbar({
            message: res.message,
            variant: 'success',
          });
          navigate(ROUTER_PATHS.AUTH);
        }
      },
      onError: (res) => {
        enqueueSnackbar({
          message: getErrorMessages(res),
          variant: 'error',
        });
      },
    }
  );

  return { isPending, data, error, logoutMutation };
}
