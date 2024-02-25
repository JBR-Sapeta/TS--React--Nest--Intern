import {
  Get,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  Put,
  Body,
  Delete,
} from '@nestjs/common';

import { SuccesMessage } from '../common/classes';

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';

import { UserService } from './user.service';
import {
  DeleteUserDto,
  ProfileDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  getUserProfile(@GetAccessTokenPayload() userId: string): Promise<ProfileDto> {
    return this.userService.getUserProfile(userId);
  }

  @Put('/:userId/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateUserProfile(
    @GetAccessTokenPayload() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ProfileDto> {
    return this.userService.updateUserProfile(userId, updateUserDto);
  }

  @Put('/:userId/email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateUserEmail(
    @GetAccessTokenPayload() userId: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<ProfileDto> {
    return this.userService.updateEmail(userId, updateEmailDto);
  }

  @Put('/:userId/password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateUserPassword(
    @GetAccessTokenPayload() userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<SuccesMessage> {
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  @Delete('/:userId/delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  delteUserAccount(
    @GetAccessTokenPayload() userId: string,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<SuccesMessage> {
    return this.userService.deleteUserProfile(userId, deleteUserDto);
  }
}
