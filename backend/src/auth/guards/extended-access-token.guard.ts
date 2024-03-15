import { AuthGuard } from '@nestjs/passport';

export class ExtendedAccessTokenGuard extends AuthGuard(
  'extended-jwt-access-token',
) {}
