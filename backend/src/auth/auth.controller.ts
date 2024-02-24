import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserEntity } from '../entities';
import type { SuccesMessage } from '../common/classes';
import type { RefreshTokenPayload } from '../common/types';

import { AuthService } from './auth.service';
import {
  GetAccessTokenPayload,
  GetCurrentUser,
  GetRefreshTokenPayload,
} from './decorators';
import { AccessTokenGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';
import {
  UserEmailDto,
  CreateUserDto,
  ResetPasswordDto,
  AccessTokenDto,
  TokensDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserDto: CreateUserDto): Promise<SuccesMessage> {
    return this.authService.createUserAccount(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  signin(@GetCurrentUser() user: UserEntity): Promise<TokensDto> {
    return this.authService.login(user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  logout(@GetAccessTokenPayload() userId: string): Promise<SuccesMessage> {
    return this.authService.logout(userId);
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshToken(
    @GetRefreshTokenPayload() { userId, refreshToken }: RefreshTokenPayload,
  ): Promise<AccessTokenDto> {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('/account-recovery')
  @HttpCode(HttpStatus.OK)
  accountRecovery(@Body() userEmailDto: UserEmailDto): Promise<SuccesMessage> {
    return this.authService.accountRecovery(userEmailDto);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<SuccesMessage> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('/resend-activation-email')
  @HttpCode(HttpStatus.OK)
  resendWelcomeEmail(
    @Body() userEmailDto: UserEmailDto,
  ): Promise<SuccesMessage> {
    return this.authService.resendWelcomeEmail(userEmailDto);
  }

  @Post('/activation/:token')
  @HttpCode(HttpStatus.OK)
  activateAccount(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<SuccesMessage> {
    return this.authService.activateUserAccount(token);
  }
}
