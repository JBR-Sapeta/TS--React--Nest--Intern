export type CreateBranchError = {
  name?: string;
  address?: {
    country?: string;
    region?: string;
    postcode?: string;
    city?: string;
    streetName?: string;
    houseNumber?: string;
    lat?: number;
    long?: number;
  };
};

export type UpdateBranchError = {
  name?: string;
  address?: {
    country?: string;
    region?: string;
    postcode?: string;
    city?: string;
    streetName?: string;
    houseNumber?: string;
    lat?: number;
    long?: number;
  };
};
