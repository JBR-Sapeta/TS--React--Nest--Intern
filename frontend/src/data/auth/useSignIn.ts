import { useNavigate } from 'react-router-dom';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { Nullable } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

import { QUERY_KEY } from '../constant';
import type {
  BaseError,
  SignInBody,
  SignInError,
  TokensResponse,
  ValidationError,
} from '../types';
import { getErrorMessages, tokenDataStorage } from '../utils';

async function signIn(body: SignInBody): Promise<TokensResponse> {
  const { data } = await axios.post<TokensResponse>(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    body
  );

  return data;
}

type UseSignIn = {
  isPending: boolean;
  data?: TokensResponse;
  error: Nullable<AxiosError<ValidationError<SignInError> | BaseError>>;
  signInMutation: UseMutateFunction<
    TokensResponse,
    AxiosError<ValidationError<SignInError> | BaseError>,
    SignInBody,
    unknown
  >;
};

export function useSignIn(): UseSignIn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: signInMutation,
  } = useMutation<TokensResponse, AxiosError<BaseError>, SignInBody, unknown>({
    mutationFn: (body) => signIn(body),
    onSuccess: (res) => {
      tokenDataStorage.saveTokens(res);
      const { accessToken } = res.data;

      queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], {
        ...res,
        data: { accessToken },
      });

      navigate(ROUTER_PATHS.OFFERS);
    },
    onError: (res) => {
      enqueueSnackbar({
        message: getErrorMessages(res),
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, signInMutation };
}
