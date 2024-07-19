import { useNavigate } from 'react-router-dom';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { Nullable } from '@Common/types';
import { getErrorMessages } from '@Data/utils';
import { ROUTER_PATHS } from '@Router/constants';

import type {
  BaseError,
  BaseResponse,
  ResetPasswordBody,
  ResetPasswordError,
  ValidationError,
} from '../types';

async function resetPassword(body: ResetPasswordBody): Promise<BaseResponse> {
  const { data } = await axios.patch<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/auth/reset-password`,
    body
  );

  return data;
}

type UseResetPassword = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<ValidationError<ResetPasswordError> | BaseError>>;
  resetPasswordMutation: UseMutateFunction<
    BaseResponse,
    AxiosError<ValidationError<ResetPasswordError> | BaseError>,
    ResetPasswordBody,
    unknown
  >;
};

export function useResetPassword(): UseResetPassword {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: resetPasswordMutation,
  } = useMutation<
    BaseResponse,
    AxiosError<ValidationError<ResetPasswordError> | BaseError>,
    ResetPasswordBody,
    unknown
  >({
    mutationFn: (body) => resetPassword(body),
    onSuccess: () => {
      navigate(ROUTER_PATHS.AUTH);
    },
    onError: (res) => {
      enqueueSnackbar({
        message: getErrorMessages(res),
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, resetPasswordMutation };
}
