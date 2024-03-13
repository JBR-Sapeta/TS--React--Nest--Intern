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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SuccessMessageDto } from '../common/classes';
import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';

import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/request';
import { CompanyDto } from './dto/response';

@ApiTags('Company')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  getCompanyBySlug(@Param('slug') slug: string): Promise<CompanyDto> {
    return this.companyService.getCompanyBySlug(slug);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AccessTokenGuard)
  createCompany(
    @GetAccessTokenPayload() userId: string,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<SuccessMessageDto> {
    return this.companyService.createCompany(userId, createCompanyDto);
  }

  @Put('/:companyId/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateCompany(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetAccessTokenPayload() userId: string,
  ): Promise<SuccessMessageDto> {
    return this.companyService.updateCompany(
      userId,
      companyId,
      updateCompanyDto,
    );
  }

  @Delete('/:companyId/delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  deleteCompany(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokenPayload() userId: string,
  ): Promise<SuccessMessageDto> {
    return this.companyService.deleteCompany(userId, companyId);
  }
}
