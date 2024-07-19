export type AccountActivationToken = {
  token: string;
};

export type AccountRecoveryBody = {
  email: string;
};

export type ResetPasswordBody = {
  resetToken: string;
  password: string;
};

export type SignInBody = {
  email: string;
  password: string;
};

export type SignUpBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
