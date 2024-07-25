import { BaseOfferData } from '../offer';
import { UserPreview } from '../user';
import { ResponseWithPagination } from '../utils';

export type ApplicationsSearchParams = {
  pageNumber?: number;
  limit?: number;
};

export type UserApplicationsResponse = ResponseWithPagination<UserApplication>;
export type UserApplication = {
  id: number;
  message: string;
  isDownloaded: boolean;
  createdAt: string;
  offer: BaseOfferData;
};

export type OfferApplicationsResponse =
  ResponseWithPagination<OfferApplication>;

export type OfferApplication = {
  id: number;
  message: string;
  isDownloaded: boolean;
  createdAt: string;
  user: UserPreview;
};
