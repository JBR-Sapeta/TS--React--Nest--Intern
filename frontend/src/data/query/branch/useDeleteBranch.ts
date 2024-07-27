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

async function deleteBranch(
  comapnyId: string,
  branchId: number,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.delete<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/branches/${comapnyId}/${branchId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type MutationParams = {
  companyId: string;
  branchId: number;
};

type UseDeleteBranch = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<BaseError>>;
  deleteBranchMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    MutationParams,
    unknown
  >;
};

export function useDeleteBranch(): UseDeleteBranch {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: deleteBranchMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    MutationParams,
    unknown
  >({
    mutationFn: ({ companyId, branchId }) =>
      deleteBranch(companyId, branchId, accessToken),
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

  return { isPending, data, error, deleteBranchMutation };
}
