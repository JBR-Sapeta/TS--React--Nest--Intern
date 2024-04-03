import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserEntity } from '../entities';
import { SuccessMessageDto } from '../common/classes';
import {
  GetAccessTokenPayload,
  GetAccessTokentExtendedPayload,
} from '../auth/decorators';
import { AccessTokenGuard, ExtendedAccessTokenGuard } from '../auth/guards';

import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/request';
import { BranchesDto } from './dto/response';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get('/:companyId')
  @HttpCode(HttpStatus.OK)
  getCompanyBranches(
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<BranchesDto> {
    return this.branchService.getCompanyBranches(companyId);
  }

  @Post('/:companyId/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ExtendedAccessTokenGuard)
  createCompanyBranch(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokentExtendedPayload() user: UserEntity,
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<SuccessMessageDto> {
    console.log(createBranchDto);
    return this.branchService.createBranch(companyId, user, createBranchDto);
  }

  @Put('/:companyId/:branchId/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  updateCompanyBranch(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('branchId', ParseIntPipe) branchId: number,
    @GetAccessTokenPayload() userId: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<SuccessMessageDto> {
    return this.branchService.updateBranch(
      companyId,
      branchId,
      userId,
      updateBranchDto,
    );
  }

  @Delete('/:companyId/:branchId/delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  deleteCompanyBranch(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('branchId', ParseIntPipe) branchId: number,
    @GetAccessTokenPayload() userId: string,
  ): Promise<SuccessMessageDto> {
    return this.branchService.deleteBranch(companyId, branchId, userId);
  }
}
