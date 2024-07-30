import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import fileDownload from 'js-file-download';

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
  applicationId: number;
  fileName: string;
};

type UseGetApplicationFile = {
  isPending: boolean;
  data?: Optional<Blob>;
  error: Nullable<AxiosError<BaseError>>;
  getApplicationFile: UseMutateFunction<
    Optional<Blob>,
    AxiosError<BaseError>,
    null,
    unknown
  >;
};

export function useGetApplicationFile({
  applicationId,
  fileName,
}: UseGetApplicationFileProps): UseGetApplicationFile {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: getApplicationFile,
  } = useMutation<Optional<Blob>, AxiosError<BaseError>, null, unknown>({
    mutationFn: () => fetchApplicationFile(applicationId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.OFFER_APPLICATIONS, applicationId],
        });
        enqueueSnackbar({
          message: 'Pobieranie zakończone',
          variant: 'success',
        });
        fileDownload(res, fileName);
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
