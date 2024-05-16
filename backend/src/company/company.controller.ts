import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { UserEntity } from '../entities';
import { AccessTokenGuard, ExtendedAccessTokenGuard } from '../auth/guards';
import {
  GetAccessTokenPayload,
  GetAccessTokentExtendedPayload,
} from '../auth/decorators';
import { SuccessMessageDto } from '../common/classes';
import { PaginationParams } from '../common/classes/params';
import { HEADER } from '../common/docs';
import { imageFileFilter } from '../common/functions';
import { JwtPayload, Optional } from '../common/types';

import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  ResetCompanyImagesDto,
  UpdateCompanyDto,
} from './dto/request';
import {
  CompaniesPreviewResponseDto,
  PartialCompanyResponseDto,
} from './dto/response';
import { OPERATION, PARAM, RES } from './docs';

@ApiTags('Company')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_COMPANIES)
  @ApiResponse(RES.GET_COMPANIES.OK)
  @ApiResponse(RES.GET_COMPANIES.INTERNAL_SERVER_ERROR)
  getCompanies(
    @Query() { pageNumber, limit }: PaginationParams,
  ): Promise<CompaniesPreviewResponseDto> {
    return this.companyService.getCompanies(pageNumber, limit);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_COMPANY_BY_SLUG)
  @ApiResponse(RES.GET_COMPANY_BY_SLUG.OK)
  @ApiResponse(RES.GET_COMPANY_BY_SLUG.NOT_FOUND)
  @ApiResponse(RES.GET_COMPANY_BY_SLUG.INTERNAL_SERVER_ERROR)
  getCompanyBySlug(
    @Param('slug') slug: string,
  ): Promise<PartialCompanyResponseDto> {
    return this.companyService.getCompanyBySlug(slug);
  }

  @Post('/create')
  @UseGuards(ExtendedAccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(OPERATION.CREATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiResponse(RES.CREATE.OK)
  @ApiResponse(RES.CREATE.BAD_REQUEST)
  @ApiResponse(RES.CREATE.UNAUTHORIZED)
  @ApiResponse(RES.CREATE.FORBIDDEN)
  @ApiResponse(RES.CREATE.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.CREATE.CONFLICT)
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.companyService.createCompany(user, createCompanyDto);
  }

  @Put('/:companyId/update')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.UPDATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiResponse(RES.UPDATE.OK)
  @ApiResponse(RES.UPDATE.BAD_REQUEST)
  @ApiResponse(RES.UPDATE.UNAUTHORIZED)
  @ApiResponse(RES.UPDATE.FORBIDDEN)
  @ApiResponse(RES.UPDATE.NOT_FOUND)
  @ApiResponse(RES.UPDATE.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.UPDATE.CONFLICT)
  updateCompany(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ): Promise<SuccessMessageDto> {
    return this.companyService.updateCompany(
      userId,
      companyId,
      updateCompanyDto,
    );
  }

  @Put('/:companyId/upload-images')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logoFile', maxCount: 1 },
        { name: 'mainPhotoFile', maxCount: 1 },
      ],
      { fileFilter: imageFileFilter },
    ),
  )
  @HttpCode(HttpStatus.OK)
  uploadCompanyImages(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @UploadedFiles()
    files: Optional<{
      logoFile?: Express.Multer.File[];
      mainPhotoFile?: Express.Multer.File[];
    }>,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ) {
    return this.companyService.uploadCompanyImages(companyId, userId, files);
  }

  @Put('/:companyId/reset-images')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  resetCompanyImages(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() resetCompanyImagesDto: ResetCompanyImagesDto,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ) {
    return this.companyService.resetCompanyImages(
      companyId,
      userId,
      resetCompanyImagesDto,
    );
  }

  @Delete('/:companyId/delete')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.DELETE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiResponse(RES.DELETE.OK)
  @ApiResponse(RES.DELETE.UNAUTHORIZED)
  @ApiResponse(RES.DELETE.FORBIDDEN)
  @ApiResponse(RES.DELETE.NOT_FOUND)
  @ApiResponse(RES.DELETE.INTERNAL_SERVER_ERROR)
  deleteCompany(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ): Promise<SuccessMessageDto> {
    return this.companyService.deleteCompany(userId, companyId);
  }
}
