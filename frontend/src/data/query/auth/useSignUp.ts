import { useNavigate } from 'react-router-dom';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { Nullable } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

import type {
  BaseError,
  BaseResponse,
  SignUpBody,
  SignUpError,
  TokensResponse,
  ValidationError,
} from '../../types';
import { getErrorMessages } from '../../utils';

async function signUp(body: SignUpBody): Promise<TokensResponse> {
  const { data } = await axios.post<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/auth/signup`,
    body
  );

  return data;
}

type UseSignUp = {
  isPending: boolean;
  data?: BaseResponse;
  error: Nullable<AxiosError<ValidationError<SignUpError> | BaseError>>;
  signUpMutation: UseMutateFunction<
    BaseResponse,
    AxiosError<ValidationError<SignUpError> | BaseError>,
    SignUpBody,
    unknown
  >;
};

export function useSignUp(): UseSignUp {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: signUpMutation,
  } = useMutation<
    BaseResponse,
    AxiosError<ValidationError<SignUpError> | BaseError>,
    SignUpBody,
    unknown
  >({
    mutationFn: (body) => signUp(body),
    onSuccess: (res) => {
      enqueueSnackbar({
        message: res.message,
        variant: 'success',
      });
      navigate(ROUTER_PATHS.AUTH_INFO);
    },
    onError: (res) => {
      enqueueSnackbar({
        message: getErrorMessages(res),
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, signUpMutation };
}
