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
import type { SuccesMessage } from '../common/classes';
import type { RefreshTokenPayload } from '../common/types';

import {
  GetAccessTokenPayload,
  GetCurrentUser,
  GetRefreshTokenPayload,
} from './decorators';
import { CreateUserDto, ProfileDto } from './dto';
import { AccessTokenGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { AccessTokenDto } from './dto/access-token.dto';

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

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshToken(
    @GetRefreshTokenPayload() { userId, refreshToken }: RefreshTokenPayload,
  ): Promise<AccessTokenDto> {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  getUserProfile(@GetAccessTokenPayload() userId: string): Promise<ProfileDto> {
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
