import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';
import { useGetAccessToken } from '@Data/auth';

import type {
  BaseError,
  BaseResponse,
  TokensResponse,
  UpdatePasswordError,
  UpdatePasswordBody,
  ValidationError,
} from '../types';
import { getErrorMessages } from '../utils';

import { useGetUserProfile } from './useGetUserProfile';

async function updatePassword(
  body: UpdatePasswordBody,
  userId?: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(userId) || isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.put<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/users/${userId}/password`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseUpdatePassword = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<ValidationError<UpdatePasswordError> | BaseError>>;
  updateEmailMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdatePasswordError> | BaseError>,
    UpdatePasswordBody,
    unknown
  >;
};

export function useUpdatePassword(): UseUpdatePassword {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();
  const { userProfile } = useGetUserProfile();

  const {
    isPending,
    data,
    error,
    mutate: updateEmailMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdatePasswordError> | BaseError>,
    UpdatePasswordBody,
    unknown
  >({
    mutationFn: (body) => updatePassword(body, userProfile?.id, accessToken),
    onSuccess: (res) => {
      if (res) {
        enqueueSnackbar({
          message: res.message,
          variant: 'success',
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

  return { isPending, data, error, updateEmailMutation };
}
