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
import {
  ApiBasicAuth,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { UserEntity } from '../entities';
import type { SuccesMessage } from '../common/classes';
import type { RefreshTokenPayload } from '../common/types';
import { HEADER } from '../common/docs';

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
import { BODY, OPERATION, PARAM, RES } from './docs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(OPERATION.SIGN_UP)
  @ApiResponse(RES.SIGN_UP.CREATED)
  @ApiResponse(RES.SIGN_UP.BAD_REQUEST)
  @ApiResponse(RES.SIGN_UP.CONFLICT)
  @ApiResponse(RES.SIGN_UP.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.SIGN_UP.BAD_GATEWAY)
  signup(@Body() createUserDto: CreateUserDto): Promise<SuccesMessage> {
    return this.authService.createUserAccount(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation(OPERATION.LOGIN)
  @ApiBasicAuth()
  @ApiBody(BODY.LOGIN)
  @ApiResponse(RES.LOGIN.OK)
  @ApiResponse(RES.LOGIN.BAD_REQUEST)
  @ApiResponse(RES.LOGIN.UNAUTHORIZED)
  @ApiResponse(RES.LOGIN.INTERNAL_SERVER_ERROR)
  signin(@GetCurrentUser() user: UserEntity): Promise<TokensDto> {
    return this.authService.login(user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation(OPERATION.LOGOUT)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiResponse(RES.LOGOUT.OK)
  @ApiResponse(RES.LOGOUT.UNAUTHORIZED)
  @ApiResponse(RES.LOGOUT.FORBIDDEN)
  @ApiResponse(RES.LOGOUT.INTERNAL_SERVER_ERROR)
  logout(@GetAccessTokenPayload() userId: string): Promise<SuccesMessage> {
    return this.authService.logout(userId);
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation(OPERATION.REFRESH_TOKEN)
  @ApiBearerAuth()
  @ApiHeader(HEADER.REFRESH_TOKEN)
  @ApiResponse(RES.REFRESH_TOKEN.UNAUTHORIZED)
  @ApiResponse(RES.REFRESH_TOKEN.FORBIDDEN)
  @ApiResponse(RES.REFRESH_TOKEN.INTERNAL_SERVER_ERROR)
  refreshToken(
    @GetRefreshTokenPayload() { userId, refreshToken }: RefreshTokenPayload,
  ): Promise<AccessTokenDto> {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('/account-recovery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.ACCOUNT_RECOVERY)
  @ApiResponse(RES.ACCOUNT_RECOVERY.OK)
  @ApiResponse(RES.ACCOUNT_RECOVERY.BAD_REQUEST)
  @ApiResponse(RES.ACCOUNT_RECOVERY.NOT_FOUND)
  @ApiResponse(RES.ACCOUNT_RECOVERY.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.ACCOUNT_RECOVERY.BAD_GATEWAY)
  accountRecovery(@Body() userEmailDto: UserEmailDto): Promise<SuccesMessage> {
    return this.authService.accountRecovery(userEmailDto);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.RESET_PASSWORD)
  @ApiResponse(RES.RESET_PASSWORD.OK)
  @ApiResponse(RES.RESET_PASSWORD.BAD_REQUEST)
  @ApiResponse(RES.RESET_PASSWORD.FORBIDDEN)
  @ApiResponse(RES.RESET_PASSWORD.INTERNAL_SERVER_ERROR)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<SuccesMessage> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('/resend-activation-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.RESEND_ACTIVATION_EMAIL)
  @ApiResponse(RES.RESEND_ACTIVATION_EMAIL.OK)
  @ApiResponse(RES.RESEND_ACTIVATION_EMAIL.BAD_REQUEST)
  @ApiResponse(RES.RESEND_ACTIVATION_EMAIL.FORBIDDEN)
  @ApiResponse(RES.RESEND_ACTIVATION_EMAIL.NOT_FOUND)
  @ApiResponse(RES.RESEND_ACTIVATION_EMAIL.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.RESEND_ACTIVATION_EMAIL.BAD_GATEWAY)
  resendWelcomeEmail(
    @Body() userEmailDto: UserEmailDto,
  ): Promise<SuccesMessage> {
    return this.authService.resendWelcomeEmail(userEmailDto);
  }

  @Post('/activation/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.ACTIVATION)
  @ApiParam(PARAM.ACTIVATION_TOKEN)
  @ApiResponse(RES.ACTIVATION.OK)
  @ApiResponse(RES.ACTIVATION.BAD_REQUEST)
  @ApiResponse(RES.ACTIVATION.FORBIDDEN)
  @ApiResponse(RES.ACTIVATION.INTERNAL_SERVER_ERROR)
  activateAccount(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<SuccesMessage> {
    return this.authService.activateUserAccount(token);
  }
}
