export type CreateBranchBody = {
  name: string;
  address: {
    country: string;
    region: string;
    postcode: string;
    city: string;
    streetName: string;
    houseNumber: string;
    lat: number;
    long: number;
  };
};

export type UpdateBranchBody = {
  name?: string;
  address?: {
    country: string;
    region: string;
    postcode: string;
    city: string;
    streetName: string;
    houseNumber: string;
    lat: number;
    long: number;
  };
};
