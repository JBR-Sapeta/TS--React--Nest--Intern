import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isEmpty, isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';
import { useGetAccessToken } from '@Data/auth';

import { QUERY_KEY } from '../constant';
import type {
  BaseError,
  BaseResponse,
  TokensResponse,
  UpdateProfileBody,
  UpdateProfileError,
  ValidationError,
} from '../types';
import { getErrorMessages } from '../utils';

import { useGetUserProfile } from './useGetUserProfile';

async function updateProfile(
  body: UpdateProfileBody,
  userId?: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(userId) || isNil(accessToken) || isEmpty(body)) {
    return undefined;
  }

  const { data } = await axios.put<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/users/${userId}/update`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseUpdateProfile = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<ValidationError<UpdateProfileError> | BaseError>>;
  updateEmailMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateProfileError> | BaseError>,
    UpdateProfileBody,
    unknown
  >;
};

export function useUpdateProfile(): UseUpdateProfile {
  const queryClient = useQueryClient();
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
    AxiosError<ValidationError<UpdateProfileError> | BaseError>,
    UpdateProfileBody,
    unknown
  >({
    mutationFn: (body) => updateProfile(body, userProfile?.id, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_PROFILE] });
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
