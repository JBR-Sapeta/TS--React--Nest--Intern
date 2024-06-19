import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SuccessMessageDto } from '../common/classes';
import { Roles } from '../common/enums';
import {
  CompanyAdminParams,
  CompanyParams,
  DateParams,
  PaginationParams,
  UserParams,
} from '../common/classes/params';
import { UserEntity } from '../entities';

import { GetAccessTokentExtendedPayload } from '../auth/decorators';
import { ExtendedAccessTokenGuard, RolesGuard } from '../auth/guards';

import { AdminService } from './admin.service';

@ApiTags('App')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/companies')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  getCompanies(
    @Query() companyAdminParams: CompanyAdminParams,
    @Query() companyParams: CompanyParams,
    @Query() paginationParams: PaginationParams,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ) {
    return this.adminService.getCompanies(
      companyAdminParams,
      companyParams,
      paginationParams,
      user,
    );
  }

  @Get('/logs')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  rootPage(
    @Query() dateParams: DateParams,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.adminService.getLogs({ ...dateParams, user });
  }

  @Get('/users')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  getUser(
    @Query() userParams: UserParams,
    @Query() paginationParams: PaginationParams,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ) {
    return this.adminService.getUsers(userParams, paginationParams, user);
  }

  @Post('/companies/:companyId/is-verified')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  verifyCompany(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.adminService.toggleIsVerified(companyId, user);
  }

  @Post('/users/:userId/has-ban')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  updateHasBan(
    @Param('userId', ParseUUIDPipe) usersIdParam: string,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.adminService.toggleHasBan(usersIdParam, user);
  }
}
