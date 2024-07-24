import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  CreateBranchBody,
  CreateBranchError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function createBranch(
  body: CreateBranchBody,
  companyId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.post<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/branches/${companyId}/create`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseCreateBranchProps = {
  companyId: string;
};

type UseCreateBranch = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<ValidationError<CreateBranchError> | BaseError>>;
  createBranchMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateBranchError> | BaseError>,
    CreateBranchBody,
    unknown
  >;
};

export function useCreateBranch({
  companyId,
}: UseCreateBranchProps): UseCreateBranch {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: createBranchMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<CreateBranchError> | BaseError>,
    CreateBranchBody,
    unknown
  >({
    mutationFn: (body) => createBranch(body, companyId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.USER_COMPANY],
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

  return { isPending, data, error, createBranchMutation };
}
