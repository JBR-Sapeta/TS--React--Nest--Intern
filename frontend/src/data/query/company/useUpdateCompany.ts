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

import { useGetAccessToken } from '../auth';
import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  UpdateCompanyBody,
  UpdateCompanyError,
} from '../../types';
import { getErrorMessages } from '../../utils';

async function updateCompany(
  body: UpdateCompanyBody,
  companyId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }
  const { data } = await axios.put<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/companies/${companyId}/update`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseUpdateCompanyProps = {
  companyId: string;
};

type UseUpdateCompany = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<ValidationError<UpdateCompanyError> | BaseError>>;
  updateCompanyMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateCompanyError> | BaseError>,
    UpdateCompanyBody,
    unknown
  >;
};

export function useUpdateCompany({
  companyId,
}: UseUpdateCompanyProps): UseUpdateCompany {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: updateCompanyMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateCompanyError> | BaseError>,
    UpdateCompanyBody,
    unknown
  >({
    mutationFn: (body) => updateCompany(body, companyId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_COMPANY] });
        enqueueSnackbar({
          message: res.message,
          variant: 'success',
        });
        navigate(ROUTER_PATHS.COMPANY);
      }
    },
    onError: (res) => {
      enqueueSnackbar({
        message: getErrorMessages(res),
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, updateCompanyMutation };
}
