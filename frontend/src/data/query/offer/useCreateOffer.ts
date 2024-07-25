import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import type {
  BaseError,
  ValidationError,
  BaseResponse,
  CreateOfferBody,
  CreateOfferError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function createOffer(
  body: CreateOfferBody,
  companyId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.post<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/offers/${companyId}/create`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseCreateOfferProps = {
  companyId: string;
};

type UseCreateOffer = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<ValidationError<CreateOfferError> | BaseError>>;
  createOfferMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateOfferError> | BaseError>,
    CreateOfferBody,
    unknown
  >;
};

export function useCreateOffer({
  companyId,
}: UseCreateOfferProps): UseCreateOffer {
  // const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: createOfferMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateOfferError> | BaseError>,
    CreateOfferBody,
    unknown
  >({
    mutationFn: (body) => createOffer(body, companyId, accessToken),
    onSuccess: (res) => {
      if (res) {
        // @ TO DO - Invalidate company offers
        // queryClient.invalidateQueries({
        //   queryKey: [QUERY_KEY.COMPANY_OFFERS],
        // });
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

  return { isPending, data, error, createOfferMutation };
}
