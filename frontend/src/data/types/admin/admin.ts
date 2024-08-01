export type AdminCompanySearchParams = {
  pageNumber?: number;
  limit?: number;
  name?: string;
  slug?: string;
  email?: string;
  owner?: boolean;
  isVerified?: boolean;
};

export type AdminUserSearchParams = {
  pageNumber?: number;
  limit?: number;
  firstName?: string;
  lastName?: string;
  email?: number;
  hasBan?: boolean;
};
