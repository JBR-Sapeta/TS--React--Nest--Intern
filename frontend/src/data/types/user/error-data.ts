export type UpdateEmailError = {
  email?: string;
  password?: string;
};

export type UpdatePasswordError = {
  newPassword?: string;
  password?: string;
};

export type UpdateProfileError = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};
