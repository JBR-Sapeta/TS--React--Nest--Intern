import { Role } from '@Common/types';
import type { Nullable } from '@Common/types';

import { ResponseWithData, ResponseWithPagination } from '../utils';

export type UserProfileResponse = ResponseWithData<UserProfile>;
export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: Nullable<string>;
  roles: Role[];
  applications: number[];
  createdAt: string;
};

export type UserAdminPreviewsResponse =
  ResponseWithPagination<UserAdminPreview>;
export type UserAdminPreview = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: Nullable<string>;
  hasBan: boolean;
  isActive: boolean;
  createdAt: string;
};

export type UserPreview = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};
