import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import type { Nullable, Optional } from '@Common/types';
import { getErrorMessages } from '@Data/utils';

import type { BaseError } from '../../types';

import { QUERY_KEY } from '../../constant';
import { useGetAccessToken } from '../auth';

async function fetchApplicationFile(
  applicationId: number,
  accessToken?: string
): Promise<Optional<Blob>> {
  const { data } = await axios.get<Blob>(
    `${import.meta.env.VITE_API_URL}/applications/${applicationId}/file`,
    {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetApplicationFileProps = {
  offerId: number;
};

type UseGetApplicationFile = {
  isPending: boolean;
  data?: Optional<Blob>;
  error: Nullable<AxiosError<BaseError>>;
  getApplicationFile: UseMutateFunction<
    Optional<Blob>,
    AxiosError<BaseError>,
    number,
    unknown
  >;
};

export function useGetApplicationFile({
  offerId,
}: UseGetApplicationFileProps): UseGetApplicationFile {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: getApplicationFile,
  } = useMutation<Optional<Blob>, AxiosError<BaseError>, number, unknown>({
    mutationFn: (applicationId) =>
      fetchApplicationFile(applicationId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.OFFER_APPLICATIONS, offerId],
        });
        enqueueSnackbar({
          message: 'Pobieranie zakończone',
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

  return { isPending, data, error, getApplicationFile };
}
