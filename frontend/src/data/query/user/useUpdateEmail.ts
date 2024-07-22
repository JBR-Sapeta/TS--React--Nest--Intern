import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  BaseResponse,
  TokensResponse,
  UpdateEmailBody,
  UpdateEmailError,
  ValidationError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth/useGetAccessToken';
import { useGetUserProfile } from './useGetUserProfile';

async function updateEmail(
  body: UpdateEmailBody,
  userId?: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(userId) || isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.put<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/users/${userId}/email`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseUpdateEmail = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<ValidationError<UpdateEmailError> | BaseError>>;
  updateEmailMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateEmailError> | BaseError>,
    UpdateEmailBody,
    unknown
  >;
};

export function useUpdateEmail(): UseUpdateEmail {
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
    AxiosError<ValidationError<UpdateEmailError> | BaseError>,
    UpdateEmailBody,
    unknown
  >({
    mutationFn: (body) => updateEmail(body, userProfile?.id, accessToken),
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
