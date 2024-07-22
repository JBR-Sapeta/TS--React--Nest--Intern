import { useNavigate } from 'react-router';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import { convertStringToBase64 } from '@Common/functions';
import type { Nullable, Optional } from '@Common/types';
import { QUERY_KEY } from '@Data/constant';
import { ROUTER_PATHS } from '@Router/constants';

import type {
  BaseError,
  BaseResponse,
  TokensResponse,
  DeleteProfileBody,
} from '../../types';
import {
  getErrorMessages,
  tokenDataStorage,
  profileDataStorage,
} from '../../utils';
import { useGetUserProfile } from './useGetUserProfile';

async function deleteProfile(
  body: DeleteProfileBody,
  userId?: string,
  email?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(userId) || isNil(email)) {
    return undefined;
  }

  const credentials = convertStringToBase64(`${email}:${body.password}`);

  const { data } = await axios.delete<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/users/${userId}/delete`,
    {
      headers: {
        Authorization: `Basic  ${credentials}`,
      },
    }
  );

  return data;
}

type UseDeleteProfil = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<BaseError>>;
  deleteProfilMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    DeleteProfileBody,
    unknown
  >;
};

export function useDeleteProfil(): UseDeleteProfil {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { userProfile } = useGetUserProfile();

  const {
    isPending,
    data,
    error,
    mutate: deleteProfilMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    DeleteProfileBody,
    unknown
  >({
    mutationFn: (body) =>
      deleteProfile(body, userProfile?.id, userProfile?.email),
    onSuccess: (res) => {
      if (res) {
        tokenDataStorage.removeTokens();
        profileDataStorage.removeProfile();
        queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], null);
        queryClient.setQueryData([QUERY_KEY.USER_PROFILE], null);
        navigate(ROUTER_PATHS.OFFERS);
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

  return { isPending, data, error, deleteProfilMutation };
}
