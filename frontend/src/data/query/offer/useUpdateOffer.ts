import { useNavigate } from 'react-router';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isEmpty, isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  UpdateOfferBody,
  UpdateOfferError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function updateOffer(
  body: UpdateOfferBody,
  companyId: string,
  offerId: number,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken) || isEmpty(body)) {
    return undefined;
  }

  const { data } = await axios.patch<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/offers/${companyId}/${offerId}/update`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseUpdateOfferProps = {
  companyId: string;
  offerId: number;
};

type UseUpdateOffer = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<ValidationError<UpdateOfferError> | BaseError>>;
  updateOfferMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateOfferError> | BaseError>,
    UpdateOfferBody,
    unknown
  >;
};

export function useUpdateOffer({
  companyId,
  offerId,
}: UseUpdateOfferProps): UseUpdateOffer {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: updateOfferMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateOfferError> | BaseError>,
    UpdateOfferBody,
    unknown
  >({
    mutationFn: (body) => updateOffer(body, companyId, offerId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.COMPANY_OFFERS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.COMPANY_OFFER, offerId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.OFFER, offerId],
        });
        enqueueSnackbar({
          message: res.message,
          variant: 'success',
        });

        navigate(ROUTER_PATHS.COMPANY_OFFERS);
      }
    },
    onError: (res) => {
      enqueueSnackbar({
        message: getErrorMessages(res),
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, updateOfferMutation };
}
