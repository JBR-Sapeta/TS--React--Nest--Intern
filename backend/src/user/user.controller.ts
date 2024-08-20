import {
  Get,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  Headers,
  Patch,
  Body,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { SuccessMessageDto } from '../common/classes';
import { convertBase64ToUtf8 } from '../common/functions';
import { HEADER } from '../common/docs';
import { JwtPayload } from '../common/types';

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';

import { UserService } from './user.service';
import { ProfileDto } from './dto/response';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/request';
import { OPERATION, PARAM, RES } from './docs';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.ME)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiResponse(RES.ME.OK)
  @ApiResponse(RES.ME.UNAUTHORIZED)
  @ApiResponse(RES.ME.NOT_FOUND)
  @ApiResponse(RES.ME.INTERNAL_SERVER_ERROR)
  getUserProfile(
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ): Promise<ProfileDto> {
    return this.userService.getUserProfile(userId);
  }

  @Patch('/:userId/update')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.UPDATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.UPDATE.OK)
  @ApiResponse(RES.UPDATE.BAD_REQUEST)
  @ApiResponse(RES.UPDATE.UNAUTHORIZED)
  @ApiResponse(RES.UPDATE.NOT_FOUND)
  @ApiResponse(RES.UPDATE.INTERNAL_SERVER_ERROR)
  updateUserProfile(
    @Param('userId', ParseUUIDPipe) userIdParam: string,
    @GetAccessTokenPayload() { userId }: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessMessageDto> {
    return this.userService.updateUserProfile(
      userId,
      userIdParam,
      updateUserDto,
    );
  }

  @Patch('/:userId/email')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.EMAIL)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.EMAIL.OK)
  @ApiResponse(RES.EMAIL.BAD_REQUEST)
  @ApiResponse(RES.EMAIL.UNAUTHORIZED)
  @ApiResponse(RES.EMAIL.NOT_FOUND)
  @ApiResponse(RES.EMAIL.CONFLICT)
  @ApiResponse(RES.EMAIL.INTERNAL_SERVER_ERROR)
  updateUserEmail(
    @Param('userId', ParseUUIDPipe) userIdParam: string,
    @GetAccessTokenPayload() { userId }: JwtPayload,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<SuccessMessageDto> {
    return this.userService.updateEmail(userId, userIdParam, updateEmailDto);
  }

  @Patch('/:userId/password')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.PASSWORD)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.PASSWORD.OK)
  @ApiResponse(RES.PASSWORD.BAD_REQUEST)
  @ApiResponse(RES.PASSWORD.UNAUTHORIZED)
  @ApiResponse(RES.PASSWORD.INTERNAL_SERVER_ERROR)
  updateUserPassword(
    @Param('userId', ParseUUIDPipe) userIdParam: string,
    @GetAccessTokenPayload() { userId }: JwtPayload,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<SuccessMessageDto> {
    return this.userService.updatePassword(
      userId,
      userIdParam,
      updatePasswordDto,
    );
  }

  @Delete('/:userId/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.DELETE)
  @ApiHeader(HEADER.BASIC)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.DELETE.OK)
  @ApiResponse(RES.DELETE.BAD_REQUEST)
  @ApiResponse(RES.DELETE.UNAUTHORIZED)
  @ApiResponse(RES.DELETE.INTERNAL_SERVER_ERROR)
  delteUserAccount(
    @Param('userId', ParseUUIDPipe) userIdParam: string,
    @Headers('authorization') authHeader: string,
  ): Promise<SuccessMessageDto> {
    const headerData = convertBase64ToUtf8(authHeader.split(' ')[1]);
    const [email, password] = headerData.split(':');

    return this.userService.deleteUserProfile(email, password, userIdParam);
  }
}
