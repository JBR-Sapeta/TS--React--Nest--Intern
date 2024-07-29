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

async function deleteOffer(
  comapnyId: string,
  offerId: number,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.delete<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/offers/${comapnyId}/${offerId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseDeleteOfferProps = {
  companyId: string;
  offerId: number;
};

type UseDeleteOffer = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<BaseError>>;
  deleteOfferMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    null,
    unknown
  >;
};

export function useDeleteOffer({
  companyId,
  offerId,
}: UseDeleteOfferProps): UseDeleteOffer {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: deleteOfferMutation,
  } = useMutation<Optional<BaseResponse>, AxiosError<BaseError>, null, unknown>(
    {
      mutationFn: () => deleteOffer(companyId, offerId, accessToken),
      onSuccess: (res) => {
        if (res) {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.COMPANY_OFFERS],
          });
          queryClient.setQueryData([QUERY_KEY.COMPANY_OFFER, offerId], null);
          queryClient.setQueryData([QUERY_KEY.OFFER, offerId], null);
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
    }
  );

  return { isPending, data, error, deleteOfferMutation };
}
