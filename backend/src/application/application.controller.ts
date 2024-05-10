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
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';

import { UserEntity } from '../entities';
import { applicationFileFilter } from '../common/functions';
import { SuccessMessageDto } from '../common/classes';
import { PaginationParams } from '../common/classes/params';
import { HEADER } from '../common/docs';

import { AccessTokenGuard, ExtendedAccessTokenGuard } from '../auth/guards';
import {
  GetAccessTokenPayload,
  GetAccessTokentExtendedPayload,
} from '../auth/decorators';

import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/request';
import {
  OfferApplicationsResponseDto,
  UserApplicationsResponseDto,
} from './dto/response';
import { OPERATION, PARAM, RES } from './docs';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('/:offerId/create')
  @UseGuards(ExtendedAccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', { fileFilter: applicationFileFilter }),
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(OPERATION.CREATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.CREATE.OK)
  @ApiResponse(RES.CREATE.BAD_REQUEST)
  @ApiResponse(RES.CREATE.UNAUTHORIZED)
  @ApiResponse(RES.CREATE.FORBIDDEN)
  @ApiResponse(RES.CREATE.NOT_FOUND)
  @ApiResponse(RES.CREATE.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.CREATE.BAD_GATEWAY)
  createApplications(
    @Param('offerId', ParseIntPipe) offerId: number,
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
    @GetAccessTokentExtendedPayload() user: UserEntity,
  ): Promise<SuccessMessageDto> {
    return this.applicationService.createApplication(
      user,
      offerId,
      createApplicationDto,
      file,
    );
  }

  @Get('/:applicationId/file')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_APPLICATION_FILE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.APPLICATION_ID)
  @ApiResponse(RES.GET_APPLICATION_FILE.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.GET_APPLICATION_FILE.UNAUTHORIZED)
  @ApiResponse(RES.GET_APPLICATION_FILE.FORBIDDEN)
  @ApiResponse(RES.GET_APPLICATION_FILE.NOT_FOUND)
  @ApiResponse(RES.GET_APPLICATION_FILE.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.GET_APPLICATION_FILE.BAD_GATEWAY)
  async getApplicationFile(
    @Param('applicationId', ParseIntPipe) applicationId: number,
    @GetAccessTokenPayload() userId: string,
    @Res() res: ExpressResponse,
  ) {
    const { buffer, contentType } =
      await this.applicationService.getApplicationFile(userId, applicationId);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="download.pdf"');
    res.send(buffer);
  }

  @Get('/offers/:offerId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_OFFER_APPLICATIONS)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.GET_OFFER_APPLICATIONS.OK)
  @ApiResponse(RES.GET_OFFER_APPLICATIONS.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.GET_OFFER_APPLICATIONS.UNAUTHORIZED)
  @ApiResponse(RES.GET_OFFER_APPLICATIONS.FORBIDDEN)
  @ApiResponse(RES.GET_OFFER_APPLICATIONS.NOT_FOUND)
  @ApiResponse(RES.GET_OFFER_APPLICATIONS.INTERNAL_SERVER_ERROR)
  getOfferApplications(
    @Query() paginationParams: PaginationParams,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() userId: string,
  ): Promise<OfferApplicationsResponseDto> {
    return this.applicationService.getOfferApplications(
      paginationParams,
      offerId,
      userId,
    );
  }

  @Get('/users/:userId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_USER_APPLICATIONS)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.USER_ID)
  @ApiResponse(RES.GET_USER_APPLICATIONS.OK)
  @ApiResponse(RES.GET_USER_APPLICATIONS.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.GET_USER_APPLICATIONS.UNAUTHORIZED)
  @ApiResponse(RES.GET_USER_APPLICATIONS.FORBIDDEN)
  @ApiResponse(RES.GET_USER_APPLICATIONS.INTERNAL_SERVER_ERROR)
  getUserApplications(
    @Query() paginationParams: PaginationParams,
    @Param('userId', ParseUUIDPipe) userId: string,
    @GetAccessTokenPayload() tokenUserId: string,
  ): Promise<UserApplicationsResponseDto> {
    return this.applicationService.getUserApplications(
      paginationParams,
      userId,
      tokenUserId,
    );
  }

  @Delete('/:offerId/delete')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.DELETE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.DELET.OK)
  @ApiResponse(RES.DELET.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.DELET.UNAUTHORIZED)
  @ApiResponse(RES.DELET.FORBIDDEN)
  @ApiResponse(RES.DELET.NOT_FOUND)
  @ApiResponse(RES.DELET.INTERNAL_SERVER_ERROR)
  @ApiResponse(RES.DELET.BAD_GATEWAY)
  deleteApplications(
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() userId: string,
  ): Promise<SuccessMessageDto> {
    return this.applicationService.deleteApplication(userId, offerId);
  }
}
