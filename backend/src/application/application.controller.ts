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
import { Response as ExpressResponse } from 'express';

import { UserEntity } from '../entities';
import { applicationFileFilter } from '../common/functions';
import { SuccessMessageDto } from '../common/classes';
import { PaginationParams } from '../common/classes/params';

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

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('/:offerId/create')
  @UseGuards(ExtendedAccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', { fileFilter: applicationFileFilter }),
  )
  @HttpCode(HttpStatus.CREATED)
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
  deleteApplications(
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() userId: string,
  ): Promise<SuccessMessageDto> {
    return this.applicationService.deleteApplication(userId, offerId);
  }
}
