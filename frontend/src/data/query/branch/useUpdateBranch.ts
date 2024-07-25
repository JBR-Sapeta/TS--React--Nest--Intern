import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isEmpty, isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  BaseError,
  ValidationError,
  BaseResponse,
  UpdateBranchBody,
  UpdateBranchError,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function updateBranch(
  body: UpdateBranchBody,
  companyId: string,
  branchId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken) || isEmpty(body)) {
    return undefined;
  }

  const { data } = await axios.put<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/branches/${companyId}/${branchId}/update`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseUpdateBranchProps = {
  companyId: string;
  branchId: string;
};

type UseUpdateBranch = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<ValidationError<UpdateBranchError> | BaseError>>;
  updateBranchMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateBranchError> | BaseError>,
    UpdateBranchBody,
    unknown
  >;
};

export function useUpdateBranch({
  companyId,
  branchId,
}: UseUpdateBranchProps): UseUpdateBranch {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();

  const {
    isPending,
    data,
    error,
    mutate: updateBranchMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<ValidationError<UpdateBranchError> | BaseError>,
    UpdateBranchBody,
    unknown
  >({
    mutationFn: (body) => updateBranch(body, companyId, branchId, accessToken),
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

  return { isPending, data, error, updateBranchMutation };
}
