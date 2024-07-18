import { Role } from '@Common/types';
import type { Nullable } from '@Common/types';

import { ResponseWithData } from '../utils/http-response';

export type UserProfileResponse = ResponseWithData<UserProfile>;
export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: Nullable<string>;
  roles: Role[];
  applications: string[];
  createdAt: string;
};
