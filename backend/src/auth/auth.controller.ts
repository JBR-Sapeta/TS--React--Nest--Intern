import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserEntity } from '../entities';
import type {
  SuccesMessage,
  SerializedPayload,
  Payload,
} from '../common/classes';
import type { AccessToken, RefreshTokenPayload, Tokens } from '../common/types';

import {
  GetAccessTokenPayload,
  GetCurrentUser,
  GetRefreshTokenPayload,
} from './decorators';
import { CreateUserDto, UserProfileDto } from './dto';
import { AccessTokenGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';
import { AuthService } from './auth.service';

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
  signin(@GetCurrentUser() user: UserEntity): Promise<Payload<Tokens>> {
    return this.authService.login(user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  logout(@GetAccessTokenPayload() userId: string): Promise<SuccesMessage> {
    return this.authService.logout(userId);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshToken(
    @GetRefreshTokenPayload() { userId, refreshToken }: RefreshTokenPayload,
  ): Promise<Payload<AccessToken>> {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  getUserProfile(
    @GetAccessTokenPayload() userId: string,
  ): Promise<SerializedPayload<typeof UserProfileDto>> {
    return this.authService.getUserProfile(userId);
  }

  @Post('/activate/:token')
  @HttpCode(HttpStatus.OK)
  activateAccount(
    @Param('token', new ParseUUIDPipe()) token: string,
  ): Promise<SuccesMessage> {
    return this.authService.activateUserAccount(token);
  }
}
