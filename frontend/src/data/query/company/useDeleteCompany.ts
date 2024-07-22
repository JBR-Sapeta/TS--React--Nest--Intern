import { useNavigate } from 'react-router-dom';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import { Nullable, Optional } from '@Common/types';
import { ROUTER_PATHS } from '@Router/constants';

import { useGetAccessToken } from '../../auth';
import { QUERY_KEY } from '../../constant';
import type { BaseError, BaseResponse } from '../../types';
import { getErrorMessages } from '../../utils';

async function deleteCompany(
  comapnyId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.delete<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/companies/${comapnyId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseDeleteCompanyProps = {
  companyId: string;
};

type UseDeleteCompany = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<BaseError>>;
  deleteCompanyMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    null,
    unknown
  >;
};

export function useDeleteCompany({
  companyId,
}: UseDeleteCompanyProps): UseDeleteCompany {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: deleteCompanyMutation,
  } = useMutation<Optional<BaseResponse>, AxiosError<BaseError>, null, unknown>(
    {
      mutationFn: () => deleteCompany(companyId, accessToken),
      onSuccess: (res) => {
        if (res) {
          queryClient.setQueryData([QUERY_KEY.USER_COMPANY], null);
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_PROFILE] });
          enqueueSnackbar({
            message: res.message,
            variant: 'success',
          });
          navigate(ROUTER_PATHS.OFFERS);
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

  return { isPending, data, error, deleteCompanyMutation };
}
