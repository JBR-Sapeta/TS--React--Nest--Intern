import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import { Nullable, Optional } from '@Common/types';

import { useGetAccessToken } from '../auth';
import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  UploadCompanyImagesBody,
  UploadCompanyImagesError,
} from '../../types';
import { getErrorMessages } from '../../utils';

async function uploadCompanyImage(
  body: UploadCompanyImagesBody,
  companyId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  const { logoFile, mainPhotoFile } = body;

  if (isNil(accessToken) || (isNil(logoFile) && isNil(mainPhotoFile))) {
    return undefined;
  }

  const formData = new FormData();

  if (logoFile) {
    formData.append('logoFile', logoFile);
  }

  if (mainPhotoFile) {
    formData.append('mainPhotoFile', mainPhotoFile);
  }

  const { data } = await axios.patch<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/companies/${companyId}/upload-images`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
}

type UseUploadCompanyImagesProps = {
  companyId: string;
};

type UseUploadCompanyImages = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<
    AxiosError<ValidationError<UploadCompanyImagesError> | BaseError>
  >;
  uploadCompanyImagesMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UploadCompanyImagesError> | BaseError>,
    UploadCompanyImagesBody,
    unknown
  >;
};

export function useUploadCompanyImages({
  companyId,
}: UseUploadCompanyImagesProps): UseUploadCompanyImages {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: uploadCompanyImagesMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UploadCompanyImagesError> | BaseError>,
    UploadCompanyImagesBody,
    unknown
  >({
    mutationFn: (body) => uploadCompanyImage(body, companyId, accessToken),
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

  return { isPending, data, error, uploadCompanyImagesMutation };
}
