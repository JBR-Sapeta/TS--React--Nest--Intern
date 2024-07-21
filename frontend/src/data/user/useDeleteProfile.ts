import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { convertStringToBase64 } from '@Common/functions';
import type { Nullable } from '@Common/types';
import { QUERY_KEY } from '@Data/constant';

import type {
  BaseError,
  BaseResponse,
  TokensResponse,
  DeleteProfileBody,
} from '../types';
import {
  getErrorMessages,
  tokenDataStorage,
  profileDataStorage,
} from '../utils';

async function deleteProfile(body: DeleteProfileBody): Promise<BaseResponse> {
  const { userId, email, password } = body;

  const credentials = convertStringToBase64(`${email}:${password}`);

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
  updateEmailMutation: UseMutateFunction<
    BaseResponse,
    AxiosError<BaseError>,
    DeleteProfileBody,
    unknown
  >;
};

export function useDeleteProfil(): UseDeleteProfil {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: updateEmailMutation,
  } = useMutation<
    BaseResponse,
    AxiosError<BaseError>,
    DeleteProfileBody,
    unknown
  >({
    mutationFn: (body) => deleteProfile(body),
    onSuccess: (res) => {
      tokenDataStorage.removeTokens();
      profileDataStorage.removeProfile();
      queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], null);
      queryClient.setQueryData([QUERY_KEY.USER_PROFILE], null);
      enqueueSnackbar({
        message: res.message,
        variant: 'success',
      });
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
