import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { isNil, isNotNil } from 'ramda';

import { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  AdminUserSearchParams,
  BaseError,
  BaseResponse,
} from '../../types';
import { getErrorMessages } from '../../utils';
import { useGetAccessToken } from '../auth';

async function banUser(
  userId: string,
  accessToken?: string
): Promise<Optional<BaseResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.patch<BaseResponse>(
    `${import.meta.env.VITE_API_URL}/admin/users/${userId}/has-ban`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseBanUserProps = {
  params: AdminUserSearchParams;
};

type UseBanUser = {
  isPending: boolean;
  data?: Optional<BaseResponse>;
  error: Nullable<AxiosError<BaseError>>;
  banUserMutation: UseMutateFunction<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    string,
    unknown
  >;
};

export function useBanUser({ params }: UseBanUserProps): UseBanUser {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useGetAccessToken();
  const keys = Object.values(params).filter((val) => isNotNil(val));

  const {
    isPending,
    data,
    error,
    mutate: banUserMutation,
  } = useMutation<
    Optional<BaseResponse>,
    AxiosError<BaseError>,
    string,
    unknown
  >({
    mutationFn: (userId) => banUser(userId, accessToken),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ADMIN_USERS, ...keys],
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

  return { isPending, data, error, banUserMutation };
}
