import { Branch } from '../branch';
import { CategoryPreview } from '../category';
import { BaseCompanyData } from '../company';
import { ResponseWithData, ResponseWithPagination } from '../utils';

export type OfferSearchParams = {
  pageNumber?: number;
  limit?: number;
  city?: string;
  region?: string;
  long?: string;
  lat?: string;
  range?: string;
  categories?: string;
  employmentTypeId?: string;
  operatingModeId?: string;
  isPaid?: string;
};

export type FullOfferDataResponse = ResponseWithData<FullOfferData>;
export type FullOfferData = {
  id: number;
  title: string;
  position: string;
  description: string;
  isPaid: boolean;
  isActive: boolean;
  expirationDate: string;
  removalDate: string;
  createdAt: string;
  updatedAt: string;
  employmentTypeId: number;
  operatingModeId: number;
  branches: Branch[];
  categories: CategoryPreview[];
  companyId: string;
};

export type OfferDataResponse = ResponseWithData<OfferData>;
export type OfferData = {
  id: number;
  title: string;
  position: string;
  description: string;
  isPaid: boolean;
  isActive: boolean;
  createdAt: string;
  expirationDate: string;
  employmentTypeId: number;
  operatingModeId: number;
  branches: Branch[];
  categories: CategoryPreview[];
  company: BaseCompanyData;
};

export type CompanyOffersResponse = ResponseWithData<OfferPreview[]>;
export type OfferPreviewsResponse = ResponseWithPagination<OfferPreview>;
export type OfferPreview = {
  id: number;
  title: string;
  position: string;
  isPaid: boolean;
  isActive: boolean;
  createdAt: string;
  employmentTypeId: number;
  operatingModeId: number;
  locations: string[];
  categories: CategoryPreview[];
  branches: Branch[];
  company: BaseCompanyData;
};

export type BaseOfferData = {
  id: string;
  slug: string;
  title: string;
  position: string;
  companyId: string;
  companyName: string;
  logoUrl: string;
  isActive: boolean;
};
