export type CreateOfferError = {
  title?: string;
  position?: string;
  description?: string;
  isPaid?: boolean;
  isActive?: boolean;
  expirationTime?: number;
  employmentType?: number;
  operatingMode?: number;
  branches?: number[];
  categories?: number[];
};

export type UpdateOfferError = {
  title?: string;
  position?: string;
  description?: string;
  isPaid?: boolean;
  isActive?: boolean;
  employmentType?: number;
  operatingMode?: number;
  branches?: number[];
  categories?: number[];
};
