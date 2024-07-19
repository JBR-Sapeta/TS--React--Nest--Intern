export type AccountRecoveryError = {
  email?: string;
};

export type ResetPasswordError = {
  password?: string;
};

export type SignInError = {
  email?: string;
  password?: string;
};

export type SignUpError = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};
