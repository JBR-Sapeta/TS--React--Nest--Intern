import type { Nullable } from '@Common/types';

export type CreateCompanyBody = {
  name: string;
  slug: string;
  email: string;
  description: string;
  size: number;
  categories: number[];
};

export type UpdateCompanyBody = {
  name: string;
  slug: string;
  email: string;
  description: string;
  size: number;
  categories: number[];
};

export type UploadCompanyImagesBody = {
  logoFile: Nullable<File>;
  mainPhotoFile: Nullable<File>;
};

export type ResetCompanyImagesBody = {
  logoFile: boolean;
  mainPhotoFile: boolean;
};
