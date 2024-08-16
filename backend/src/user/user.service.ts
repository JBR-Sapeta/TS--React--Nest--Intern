import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { isNil, isEmpty } from 'ramda';

import { PL_ERRORS, PL_MESSAGES } from '../locales';
import {
  ApplicationRepository,
  CompanyRepository,
  OfferRepository,
  UserRepository,
} from '../repository';
import { SuccessMessageDto } from '../common/classes';
import { Roles } from '../common/enums';

import { AuthService } from '../auth/auth.service';
import { S3Service } from '../s3/s3.service';

import { ProfileDto } from './dto/response';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/request';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly s3Service: S3Service,
    private readonly authService: AuthService,
    private readonly applicationRepository: ApplicationRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly offeryRepository: OfferRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async getUserProfile(userId: string): Promise<ProfileDto> {
    const user = await this.userRepository.getUserWithApplicationsById(userId);

    if (isNil(user)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_USER);
    }

    return new ProfileDto({ message: PL_MESSAGES.BASE_SUCCESS }, user);
  }

  // ----------------------------------------------------------------------- \\\
  public async updateUserProfile(
    userId: string,
    userIdParam: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SuccessMessageDto> {
    if (userId !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (isEmpty(updateUserDto)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_COMMON_NO_BODY);
    }

    await this.userRepository.updateUserProfile(userId, {
      ...updateUserDto,
    });

    return new SuccessMessageDto({ message: PL_MESSAGES.USER_ACCOUNT_UPDATE });
  }

  // ----------------------------------------------------------------------- \\\
  public async updateEmail(
    userId: string,
    userIdParam: string,
    { newEmail, password }: UpdateEmailDto,
  ): Promise<SuccessMessageDto> {
    if (userId !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const user = await this.authService.validateUserPassword(userId, password);
    await this.userRepository.updateUserEmail(user, newEmail);

    return new SuccessMessageDto({ message: PL_MESSAGES.USER_EMAIL_UPDATE });
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
    email: string,
    password: string,
    userIdParam: string,
  ): Promise<SuccessMessageDto> {
    const user = await this.authService.validateUserCredentials(
      email,
      password,
    );

    if (user.id !== userIdParam) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const userRoles = user.roles.map((role) => role.id);

    if (userRoles.includes(Roles.COMPANY)) {
      const company = await this.companyRepository.getCompanyByUserId({
        userId: user.id,
      });

      const offers = await this.offeryRepository.getCompanyOffers({
        companyId: company.id,
        applications: true,
      });

      await this.userRepository.deleteUser(user.id);

      const applications = offers.flatMap((offer) => offer.applications);

      for (const { fileKey } of applications) {
        try {
          await this.s3Service.deleteApplicationFile(fileKey);
        } catch {
          this.logger.error(
            `S3Service - deleteUserProfile - fileKey:$${fileKey}`,
          );
        }
      }

      const companyImages = [company.logoUrl, company.mainPhotoUrl];

      for (const image of companyImages) {
        try {
          if (image) {
            await this.s3Service.deleteImageFile(image);
          }
        } catch {
          const fileKey = this.s3Service.getKeyFromUrl(image);
          this.logger.error(
            `S3Service - deleteUserProfile - fileKey:$${fileKey}`,
          );
        }
      }
    }

    if (userRoles.includes(Roles.USER)) {
      const [userApplications] =
        await this.applicationRepository.getAllUserApplications(user.id);

      await this.userRepository.deleteUser(user.id);

      for (const { fileKey } of userApplications) {
        try {
          await this.s3Service.deleteApplicationFile(fileKey);
        } catch {
          this.logger.error(
            `S3Service - deleteUserProfile - fileKey:$${fileKey}`,
          );
        }
      }
    }

    if (
      userRoles.includes(Roles.ADMIN) ||
      userRoles.includes(Roles.MODERATOR)
    ) {
      await this.userRepository.deleteUser(user.id);
    }

    return new SuccessMessageDto({ message: PL_MESSAGES.USER_DELETE_ACCOUNT });
  }
}
