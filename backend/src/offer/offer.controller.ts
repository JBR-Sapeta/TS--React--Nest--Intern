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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';
import { SuccessMessageDto } from '../common/classes';
import {
  AddressParams,
  CategoriesParams,
  OfferParams,
  PaginationParams,
} from '../common/classes/params';

import { OfferService } from './offer.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/request';
import { FullOfferResponseDto, PartialOfferResponseDto } from './dto/response';

@ApiTags('Offers')
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('/:companyId/create')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  createOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokenPayload() userId: string,
    @Body() createOffetDto: CreateOfferDto,
  ): Promise<SuccessMessageDto> {
    return this.offerService.createOffer(companyId, userId, createOffetDto);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getOffers(
    @Query() paginationParams: PaginationParams,
    @Query() offerParams: OfferParams,
    @Query() locationParams: AddressParams,
    @Query() categoreisParams: CategoriesParams,
  ) {
    return this.offerService.getOffers(
      paginationParams,
      offerParams,
      locationParams,
      categoreisParams,
    );
  }

  @Get('/:companyId/:offerId/partial')
  @HttpCode(HttpStatus.OK)
  getPartialOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
  ): Promise<PartialOfferResponseDto> {
    return this.offerService.getPartialOffer(companyId, offerId);
  }

  @Get('/:companyId/:offerId/full')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  getFullOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() userId: string,
  ): Promise<FullOfferResponseDto> {
    return this.offerService.getFullOffer(companyId, offerId, userId);
  }

  @Put('/:companyId/:offerId/update')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  updateOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() userId: string,
    @Body() updateOffetDto: UpdateOfferDto,
  ): Promise<SuccessMessageDto> {
    return this.offerService.updateOffer(
      companyId,
      offerId,
      userId,
      updateOffetDto,
    );
  }

  @Delete('/:companyId/:offerId/delete')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  deleteOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() userId: string,
  ): Promise<SuccessMessageDto> {
    return this.offerService.deleteOffer(companyId, offerId, userId);
  }
}
