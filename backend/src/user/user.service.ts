import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNil } from 'ramda';

import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { UserRepository } from '../repositories';
import { SuccessMessageDto } from '../common/classes';
import { AuthService } from '../auth/auth.service';

import {
  DeleteUserDto,
  ProfileDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async getUserProfile(userId: string): Promise<ProfileDto> {
    const user = await this.userRepository.getUserById(userId);

    if (isNil(user)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_USER);
    }

    return new ProfileDto({ message: PL_MESSAGES.BASE_SUCCESS }, user);
  }

  // ----------------------------------------------------------------------- \\\
  public async updateUserProfile(
    userId: string,
    userIdParam: string,
    { firstName, lastName, phoneNumber }: UpdateUserDto,
  ): Promise<ProfileDto> {
    if (userId !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const user = await this.userRepository.updateUserProfile(userId, {
      firstName,
      lastName,
      phoneNumber,
    });

    return new ProfileDto({ message: PL_MESSAGES.USER_ACCOUNT_UPDATE }, user);
  }

  // ----------------------------------------------------------------------- \\\
  public async updateEmail(
    userId: string,
    userIdParam: string,
    { newEmail, password }: UpdateEmailDto,
  ): Promise<ProfileDto> {
    if (userId !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const user = await this.authService.validateUserPassword(userId, password);
    const updatedUser = await this.userRepository.updateUserEmail(
      user,
      newEmail,
    );

    return new ProfileDto(
      { message: PL_MESSAGES.USER_EMAIL_UPDATE },
      updatedUser,
    );
  }

  // ----------------------------------------------------------------------- \\\
  public async updatePassword(
    userId: string,
    userIdParam: string,
    { password, newPassword }: UpdatePasswordDto,
  ): Promise<SuccessMessageDto> {
    if (userId !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const user = await this.authService.validateUserPassword(userId, password);
    const hashedPassword = await this.authService.hashPassword(newPassword);
    await this.userRepository.updateUserPassword(user, hashedPassword);

    return new SuccessMessageDto({ message: PL_MESSAGES.USER_PASSWORD_UPDATE });
  }

  // ----------------------------------------------------------------------- \\\
  public async deleteUserProfile(
    userId: string,
    userIdParam: string,
    { password }: DeleteUserDto,
  ): Promise<SuccessMessageDto> {
    if (userId !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.authService.validateUserPassword(userId, password);
    await this.userRepository.deleteUser(userId);

    return new SuccessMessageDto({ message: PL_MESSAGES.USER_DELETE_ACCOUNT });
  }
}
