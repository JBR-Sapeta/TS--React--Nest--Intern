import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../constant';
import type { Category, CategoryResponse } from '../types';

export async function getCategories(): Promise<CategoryResponse> {
  const { data } = await axios.get<CategoryResponse>(
    `${import.meta.env.VITE_API_URL}/categories`
  );

  return data;
}

type UseGetCategories = {
  isLoading: boolean;
  categories?: Category[];
  error: Nullable<Error>;
};

export function useGetCategories(): UseGetCategories {
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.USER_PROFILE],
    queryFn: async (): Promise<CategoryResponse> => getCategories(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    categories: data ? data.data : undefined,
    error,
  };
}
