export type DeleteProfileBody = {
  password: string;
};

export type UpdateEmailBody = {
  newEmail: string;
  password: string;
};

export type UpdatePasswordBody = {
  newPassword: string;
  password: string;
};

export type UpdateProfileBody = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};
