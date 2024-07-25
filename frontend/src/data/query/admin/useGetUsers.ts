import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil, isNotNil } from 'ramda';

import { convertToQueryParams } from '@Common/functions';
import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  UserAdminPreviewsResponse,
  UserAdminPreview,
  AdminUserSearchParams,
} from '../../types';
import { useGetAccessToken } from '../auth';

export async function getUsers(
  params: AdminUserSearchParams,
  accessToken?: string
): Promise<Nullable<UserAdminPreviewsResponse>> {
  if (isNil(accessToken)) return null;

  const query = convertToQueryParams(params);

  const { data } = await axios.get<UserAdminPreviewsResponse>(
    `${import.meta.env.VITE_API_URL}/admin/users?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetUsersProps = {
  params: AdminUserSearchParams;
};

type UseGetUsers = {
  isLoading: boolean;
  applications?: UserAdminPreview[];
  error: Nullable<Error>;
};

export function useGetUsers({ params }: UseGetUsersProps): UseGetUsers {
  const { accessToken } = useGetAccessToken();
  const keys = Object.values(params).filter((val) => isNotNil(val));

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.ADMIN_USERS, ...keys],
    queryFn: async (): Promise<Nullable<UserAdminPreviewsResponse>> =>
      getUsers(params, accessToken),
    placeholderData: keepPreviousData,
    enabled: !!accessToken,
  });

  return {
    isLoading,
    applications: data ? data.data : undefined,
    error,
  };
}
