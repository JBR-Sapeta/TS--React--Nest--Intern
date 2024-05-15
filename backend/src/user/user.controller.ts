import {
  Get,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  Put,
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
import { HEADER } from '../common/docs';

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';

import { UserService } from './user.service';
import { ProfileDto } from './dto/response';
import {
  DeleteUserDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/request';
import { OPERATION, PARAM, RES } from './docs';
import { JwtPayload } from 'src/common/types';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
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

  @Put('/:userId/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
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
  ): Promise<ProfileDto> {
    return this.userService.updateUserProfile(
      userId,
      userIdParam,
      updateUserDto,
    );
  }

  @Put('/:userId/email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
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
  ): Promise<ProfileDto> {
    return this.userService.updateEmail(userId, userIdParam, updateEmailDto);
  }

  @Put('/:userId/password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
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
  @UseGuards(AccessTokenGuard)
  @ApiOperation(OPERATION.DELETE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.DELETE.OK)
  @ApiResponse(RES.DELETE.BAD_REQUEST)
  @ApiResponse(RES.DELETE.UNAUTHORIZED)
  @ApiResponse(RES.DELETE.INTERNAL_SERVER_ERROR)
  delteUserAccount(
    @Param('userId', ParseUUIDPipe) userIdParam: string,
    @GetAccessTokenPayload() { userId }: JwtPayload,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<SuccessMessageDto> {
    return this.userService.deleteUserProfile(
      userId,
      userIdParam,
      deleteUserDto,
    );
  }
}
