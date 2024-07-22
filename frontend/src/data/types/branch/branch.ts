import { ResponseWithData } from '../utils';

import { Address } from './address';

export type BranchesResponse = ResponseWithData<Branch[]>;
export type Branch = {
  id: number;
  name: string;
  createdAt: string;
  address: Address;
};
