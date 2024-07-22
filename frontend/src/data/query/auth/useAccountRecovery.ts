import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { Nullable } from '@Common/types';
import { getErrorMessages } from '@Data/utils';

import type {
  AccountRecoveryBody,
  AccountRecoveryError,
  BaseError,
  BaseResponse,
  ValidationError,
} from '../../types';

async function accountRecovery(
  body: AccountRecoveryBody
): Promise<BaseResponse> {
  const { data } = await axios.post<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/auth/account-recovery`,
    body
  );

  return data;
}

type UseAccountRecovery = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<
    AxiosError<ValidationError<AccountRecoveryError> | BaseError>
  >;
  accountRecoveryMutation: UseMutateFunction<
    BaseResponse,
    AxiosError<ValidationError<AccountRecoveryError> | BaseError>,
    AccountRecoveryBody,
    unknown
  >;
};

export function useAccountRecovery(): UseAccountRecovery {
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: accountRecoveryMutation,
  } = useMutation<
    BaseResponse,
    AxiosError<ValidationError<AccountRecoveryError> | BaseError>,
    AccountRecoveryBody,
    unknown
  >({
    mutationFn: (body) => accountRecovery(body),
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

  return { isPending, data, error, accountRecoveryMutation };
}
