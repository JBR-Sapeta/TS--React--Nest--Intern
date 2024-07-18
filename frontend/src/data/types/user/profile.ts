import { Nullable } from '@Common/types';

import { ResponseWithData } from '../utils/http-response';
import { Role } from './role';

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
