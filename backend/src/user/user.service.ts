import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repositories';
import { SuccesMessage } from '../common/classes';
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

    return new ProfileDto({}, user);
  }

  // ----------------------------------------------------------------------- \\\
  public async updateUserProfile(
    userId: string,
    { firstName, lastName, phoneNumber }: UpdateUserDto,
  ): Promise<ProfileDto> {
    const user = await this.userRepository.updateUserProfile(
      userId,
      firstName,
      lastName,
      phoneNumber,
    );

    return new ProfileDto({}, user);
  }

  // ----------------------------------------------------------------------- \\\
  public async updateEmail(
    userId: string,
    { newEmail, password }: UpdateEmailDto,
  ): Promise<ProfileDto> {
    const user = await this.authService.validateUserPassword(userId, password);
    const updatedUser = await this.userRepository.updateUserEmail(
      user,
      newEmail,
    );

    return new ProfileDto({}, updatedUser);
  }

  // ----------------------------------------------------------------------- \\\
  public async updatePassword(
    userId: string,
    { password, newPassword }: UpdatePasswordDto,
  ): Promise<SuccesMessage> {
    const user = await this.authService.validateUserPassword(userId, password);
    const hashedPassword = await this.authService.hashPassword(newPassword);
    await this.userRepository.updateUserPassword(user, hashedPassword);

    return new SuccesMessage({});
  }

  // ----------------------------------------------------------------------- \\\
  public async deleteUserProfile(
    userId: string,
    { password }: DeleteUserDto,
  ): Promise<SuccesMessage> {
    await this.authService.validateUserPassword(userId, password);
    await this.userRepository.deleteUser(userId);

    return new SuccesMessage({});
  }
}
