import { LoginDto } from './dto';

export const BODY = {
  LOGIN: {
    description: 'Basic authentication with password and email address.',
    type: LoginDto,
  },
};
