import { Nullable } from '@Common/types';
import { Branch } from '../branch';
import { CategoryPreview } from '../category';
import { ResponseWithData, ResponseWithPagination } from '../utils';
import { UserAdminPreview } from '../user';

export type CompanySearchParams = {
  pageNumber?: number;
  limit?: number;
  city?: string;
  region?: string;
  long?: string;
  lat?: string;
  range?: string;
  categories?: string;
};

export type FullCompanyDataResponse = ResponseWithData<FullCompanyData>;
export type FullCompanyData = {
  id: string;
  name: string;
  slug: string;
  email: string;
  phoneNumber: Nullable<string>;
  logoUrl: Nullable<string>;
  mainPhotoUrl: Nullable<string>;
  description: string;
  size: number;
  isVerified: boolean;
  createdAt: string;
  categories: CategoryPreview[];
  branches: Branch[];
};

export type CompanyDataResponse = ResponseWithData<CompanyData>;
export type CompanyData = {
  id: string;
  name: string;
  slug: string;
  email: string;
  phoneNumber: Nullable<string>;
  logoUrl: Nullable<string>;
  mainPhotoUrl: Nullable<string>;
  description: string;
  size: number;
  isVerified: boolean;
  categories: CategoryPreview[];
};

export type CompanyAdminPrewievsResponse =
  ResponseWithPagination<CompanyAdminPrewiev>;
export type CompanyAdminPrewiev = {
  id: string;
  name: string;
  slug: string;
  email: string;
  logoUrl: Nullable<string>;
  size: number;
  isVerified: boolean;
  owner: Nullable<UserAdminPreview>;
};

export type CompanyPrewievsResponse = ResponseWithPagination<CompanyPrewiev>;
export type CompanyPrewiev = {
  id: string;
  name: string;
  slug: string;
  logoUrl: Nullable<string>;
  size: number;
  locations: string[];
  categories: CategoryPreview[];
};

export type BaseCompanyData = {
  id: string;
  name: string;
  slug: string;
  logoUrl: Nullable<string>;
  size: number;
};
