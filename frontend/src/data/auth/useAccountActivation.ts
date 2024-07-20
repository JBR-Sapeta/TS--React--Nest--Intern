import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { AccountActivationToken, BaseError, BaseResponse } from '@Data/types';
import { Nullable } from '@Common/types';
import { getErrorMessages } from '@Data/utils';

async function activateAccount({
  token,
}: AccountActivationToken): Promise<BaseResponse> {
  const { data } = await axios.post<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/auth/activation/${token}`
  );

  return data;
}

type UseAccountActivation = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<BaseError>>;
  accountActivationMutation: UseMutateFunction<
    BaseResponse,
    AxiosError<BaseError>,
    AccountActivationToken,
    unknown
  >;
};

export function useAccountActivation(): UseAccountActivation {
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: accountActivationMutation,
  } = useMutation<
    BaseResponse,
    AxiosError<BaseError>,
    AccountActivationToken,
    unknown
  >({
    mutationFn: (body) => activateAccount(body),
    onSuccess: (res) => {
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

  return { isPending, data, error, accountActivationMutation };
}
