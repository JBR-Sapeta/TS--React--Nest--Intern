import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';
import { QUERY_KEY } from '@Data/constant';

import type {
  BaseError,
  ValidationError,
  BaseResponse,
  CreateApplicationBody,
  CreateApplicationError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function createApplication(
  body: CreateApplicationBody,
  offerId: number,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { file, message } = body;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('message', message);

  const { data } = await axios.post<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/applications/${offerId}/create`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
}

type UseCreateApplicationProps = {
  offerId: number;
};

type UseCreateApplication = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<
    AxiosError<ValidationError<CreateApplicationError> | BaseError>
  >;
  createApplicationMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateApplicationError> | BaseError>,
    CreateApplicationBody,
    unknown
  >;
};

export function useCreateApplication({
  offerId,
}: UseCreateApplicationProps): UseCreateApplication {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: createApplicationMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateApplicationError> | BaseError>,
    CreateApplicationBody,
    unknown
  >({
    mutationFn: (body) => createApplication(body, offerId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.USER_APPLICATIONS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.USER_PROFILE],
        });
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

  return { isPending, data, error, createApplicationMutation };
}
