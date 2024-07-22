export type CreateCompanyError = {
  name?: string;
  slug?: string;
  email?: string;
  description?: string;
  size?: string;
  categories?: string;
};

export type UpdateCompanyError = {
  name?: string;
  slug?: string;
  email?: string;
  description?: string;
  size?: string;
  categories?: string;
};

//  @ TO DO - return key of invalid file
export type UploadCompanyImagesError = {
  file?: string;
};

export type ResetCompanyImagesError = {
  logoFile?: string;
  mainPhotoFile?: string;
};
