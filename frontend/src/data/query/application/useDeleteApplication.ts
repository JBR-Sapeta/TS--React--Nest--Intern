import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { BaseError, BaseResponse } from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function deleteApplication(
  applicationId: number,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.delete<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/applications/${applicationId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseDeleteApplication = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<BaseError>>;
  deleteApplicationMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    number,
    unknown
  >;
};

export function useDeleteApplication(): UseDeleteApplication {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: deleteApplicationMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    number,
    unknown
  >({
    mutationFn: (applicationId) =>
      deleteApplication(applicationId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.USER_APPLICATIONS],
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

  return { isPending, data, error, deleteApplicationMutation };
}
