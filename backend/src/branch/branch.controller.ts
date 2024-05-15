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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserEntity } from '../entities';
import { SuccessMessageDto } from '../common/classes';
import {
  GetAccessTokenPayload,
  GetAccessTokentExtendedPayload,
} from '../auth/decorators';
import { HEADER } from '../common/docs';
import { AccessTokenGuard, ExtendedAccessTokenGuard } from '../auth/guards';

import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/request';
import { BranchesDto } from './dto/response';
import { OPERATION, PARAM, RES } from './docs';
import { JwtPayload } from 'src/common/types';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get('/:companyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_COMAPNY_BRANCHES)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiResponse(RES.GET_COMAPNY_BRANCHES.OK)
  @ApiResponse(RES.GET_COMAPNY_BRANCHES.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.GET_COMAPNY_BRANCHES.INTERNAL_SERVER_ERROR)
  getCompanyBranches(
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ): Promise<BranchesDto> {
    return this.branchService.getCompanyBranches(companyId);
  }

  @Post('/:companyId/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ExtendedAccessTokenGuard)
  @ApiOperation(OPERATION.CREATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiResponse(RES.CREATE.OK)
  @ApiResponse(RES.CREATE.BAD_REQUEST)
  @ApiResponse(RES.CREATE.UNAUTHORIZED)
  @ApiResponse(RES.CREATE.FORBIDDEN)
  @ApiResponse(RES.CREATE.NOT_FOUND)
  @ApiResponse(RES.CREATE.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.CREATE.BAD_GATEWAY)
  createCompanyBranch(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokentExtendedPayload() user: UserEntity,
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<SuccessMessageDto> {
    return this.branchService.createBranch(companyId, user, createBranchDto);
  }

  @Put('/:companyId/:branchId/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation(OPERATION.UPDATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiParam(PARAM.BRANCH_ID)
  @ApiResponse(RES.UPDATE.OK)
  @ApiResponse(RES.UPDATE.BAD_REQUEST)
  @ApiResponse(RES.UPDATE.UNAUTHORIZED)
  @ApiResponse(RES.UPDATE.FORBIDDEN)
  @ApiResponse(RES.UPDATE.NOT_FOUND)
  @ApiResponse(RES.UPDATE.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.UPDATE.BAD_GATEWAY)
  updateCompanyBranch(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('branchId', ParseIntPipe) branchId: number,
    @GetAccessTokenPayload() { userId }: JwtPayload,
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
  @ApiOperation(OPERATION.DELETE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiParam(PARAM.BRANCH_ID)
  @ApiResponse(RES.DELETE.OK)
  @ApiResponse(RES.DELETE.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.DELETE.UNAUTHORIZED)
  @ApiResponse(RES.DELETE.FORBIDDEN)
  @ApiResponse(RES.DELETE.NOT_FOUND)
  @ApiResponse(RES.DELETE.INTERNAL_SERVER_ERROR)
  deleteCompanyBranch(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('branchId', ParseIntPipe) branchId: number,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ): Promise<SuccessMessageDto> {
    return this.branchService.deleteBranch(companyId, branchId, userId);
  }
}
