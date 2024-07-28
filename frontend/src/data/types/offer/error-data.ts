export type CreateOfferError = {
  title?: string;
  position?: string;
  description?: string;
  isPaid?: string;
  isActive?: string;
  expirationTime?: string;
  employmentType?: string;
  operatingMode?: string;
  branches?: string;
  categories?: string;
};

export type UpdateOfferError = {
  title?: string;
  position?: string;
  description?: string;
  isPaid?: string;
  isActive?: string;
  employmentType?: string;
  operatingMode?: string;
  branches?: string;
  categories?: string;
};
