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
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  ResetCompanyImagesBody,
  ResetCompanyImagesError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function resetCompanyImage(
  body: ResetCompanyImagesBody,
  companyId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  const { logoUrl, mainPhotoUrl } = body;

  if (isNil(accessToken) || (!logoUrl && !mainPhotoUrl)) {
    return undefined;
  }

  const { data } = await axios.patch<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/companies/${companyId}/reset-images`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseResetCompanyImagesProps = {
  companyId: string;
};

type UseResetCompanyImages = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<
    AxiosError<ValidationError<ResetCompanyImagesError> | BaseError>
  >;
  resetCompanyImagesMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<ResetCompanyImagesError> | BaseError>,
    ResetCompanyImagesBody,
    unknown
  >;
};

export function useResetCompanyImages({
  companyId,
}: UseResetCompanyImagesProps): UseResetCompanyImages {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: resetCompanyImagesMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<ResetCompanyImagesError> | BaseError>,
    ResetCompanyImagesBody,
    unknown
  >({
    mutationFn: (body) => resetCompanyImage(body, companyId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_COMPANY] });
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

  return { isPending, data, error, resetCompanyImagesMutation };
}
