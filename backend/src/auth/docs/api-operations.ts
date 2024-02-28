export const OPERATION = {
  SIGN_UP: { description: 'Create new user account.' },
  LOGIN: { description: 'Log in to a user account.' },
  LOGOUT: { description: 'Logout from account.' },
  ACTIVATION: { description: 'Activate user account.' },
  REFRESH_TOKEN: { description: 'Generate new access token.' },
  RESEND_ACTIVATION_EMAIL: { description: 'Resend activation email.' },
  RESET_PASSWORD: { description: 'Set new password using reset token.' },
  ACCOUNT_RECOVERY: {
    description: 'Create reset token to regain access to your account.',
  },
};
