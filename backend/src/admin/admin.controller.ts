import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SuccessMessageDto } from '../common/classes';
import {
  CompanyAdminParams,
  CompanyParams,
  DateParams,
  PaginationParams,
  UserParams,
} from '../common/classes/params';
import { HEADER } from '../common/docs';
import { Roles } from '../common/enums';
import { UserEntity } from '../entities';

import { GetAccessTokentExtendedPayload } from '../auth/decorators';
import { ExtendedAccessTokenGuard, RolesGuard } from '../auth/guards';

import { AdminService } from './admin.service';
import {
  CompaniesAdminResponseDto,
  ErrorBucketsResponseDto,
  UsersAdminResponseDto,
} from './dto/response';
import { OPERATION, PARAM, RES } from './docs';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/companies')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_COMPANIES)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiResponse(RES.GET_COMPANIES.OK)
  @ApiResponse(RES.GET_COMPANIES.UNAUTHORIZED)
  @ApiResponse(RES.GET_COMPANIES.FORBIDDEN)
  @ApiResponse(RES.GET_COMPANIES.INTERNAL_SERVER_ERROR)
  getCompanies(
    @Query() companyAdminParams: CompanyAdminParams,
    @Query() companyParams: CompanyParams,
    @Query() paginationParams: PaginationParams,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<CompaniesAdminResponseDto> {
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
  @ApiOperation(OPERATION.GET_LOGS)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiResponse(RES.GET_LOGS.OK)
  @ApiResponse(RES.GET_LOGS.UNAUTHORIZED)
  @ApiResponse(RES.GET_LOGS.FORBIDDEN)
  @ApiResponse(RES.GET_LOGS.INTERNAL_SERVER_ERROR)
  rootPage(
    @Query() dateParams: DateParams,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<ErrorBucketsResponseDto> {
    return this.adminService.getLogs({ ...dateParams, user });
  }

  @Get('/users')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_USERS)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiResponse(RES.GET_USERS.OK)
  @ApiResponse(RES.GET_USERS.UNAUTHORIZED)
  @ApiResponse(RES.GET_USERS.FORBIDDEN)
  @ApiResponse(RES.GET_USERS.INTERNAL_SERVER_ERROR)
  getUser(
    @Query() userParams: UserParams,
    @Query() paginationParams: PaginationParams,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<UsersAdminResponseDto> {
    return this.adminService.getUsers(userParams, paginationParams, user);
  }

  @Patch('/companies/:companyId/is-verified')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.VERIFY_COMPANY)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiResponse(RES.VERIFY_COMPANY.OK)
  @ApiResponse(RES.VERIFY_COMPANY.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.VERIFY_COMPANY.UNAUTHORIZED)
  @ApiResponse(RES.VERIFY_COMPANY.FORBIDDEN)
  @ApiResponse(RES.VERIFY_COMPANY.NOT_FOUND)
  @ApiResponse(RES.VERIFY_COMPANY.INTERNAL_SERVER_ERROR)
  verifyCompany(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.adminService.toggleIsVerified(companyId, user);
  }

  @Patch('/users/:userId/has-ban')
  @UseGuards(RolesGuard(Roles.ADMIN))
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.BAN_USER)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.BAN_USER.OK)
  @ApiResponse(RES.BAN_USER.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.BAN_USER.UNAUTHORIZED)
  @ApiResponse(RES.BAN_USER.FORBIDDEN)
  @ApiResponse(RES.BAN_USER.NOT_FOUND)
  @ApiResponse(RES.BAN_USER.INTERNAL_SERVER_ERROR)
  updateHasBan(
    @Param('userId', ParseUUIDPipe) usersIdParam: string,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.adminService.toggleHasBan(usersIdParam, user);
  }
}
