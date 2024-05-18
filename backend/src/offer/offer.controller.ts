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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';
import { SuccessMessageDto } from '../common/classes';
import {
  AddressParams,
  CategoriesParams,
  OfferParams,
  PaginationParams,
} from '../common/classes/params';
import { HEADER } from '../common/docs';
import { JwtPayload } from '../common/types';

import { OfferService } from './offer.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/request';
import {
  FullOfferResponseDto,
  OfferPreviewsResponseDto,
  PartialOfferResponseDto,
} from './dto/response';
import { OPERATION, PARAM, RES } from './docs';

@ApiTags('Offers')
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('/:companyId/create')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
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
  createOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @GetAccessTokenPayload() { userId }: JwtPayload,
    @Body() createOffetDto: CreateOfferDto,
  ): Promise<SuccessMessageDto> {
    return this.offerService.createOffer(companyId, userId, createOffetDto);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_OFFERS)
  @ApiResponse(RES.GET_OFFERS.OK)
  @ApiResponse(RES.GET_OFFERS.BAD_REQUEST)
  @ApiResponse(RES.GET_OFFERS.INTERNAL_SERVER_ERROR)
  getOffers(
    @Query() categoreisParams: CategoriesParams,
    @Query() locationParams: AddressParams,
    @Query() offerParams: OfferParams,
    @Query() paginationParams: PaginationParams,
  ): Promise<OfferPreviewsResponseDto> {
    return this.offerService.getOffers(
      paginationParams,
      offerParams,
      locationParams,
      categoreisParams,
    );
  }

  @Get('/:companyId/:offerId/partial')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_PARTIAL_OFFER)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.GET_PARTIAL_OFFER.OK)
  @ApiResponse(RES.GET_PARTIAL_OFFER.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.GET_PARTIAL_OFFER.NOT_FOUND)
  @ApiResponse(RES.GET_PARTIAL_OFFER.INTERNAL_SERVER_ERROR)
  getPartialOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
  ): Promise<PartialOfferResponseDto> {
    return this.offerService.getPartialOffer(companyId, offerId);
  }

  @Get('/:companyId/:offerId/full')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_FULL_OFFER)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.GET_FULL_OFFER.OK)
  @ApiResponse(RES.GET_FULL_OFFER.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.GET_FULL_OFFER.UNAUTHORIZED)
  @ApiResponse(RES.GET_FULL_OFFER.FORBIDDEN)
  @ApiResponse(RES.GET_FULL_OFFER.NOT_FOUND)
  @ApiResponse(RES.GET_FULL_OFFER.INTERNAL_SERVER_ERROR)
  getFullOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ): Promise<FullOfferResponseDto> {
    return this.offerService.getFullOffer(companyId, offerId, userId);
  }

  @Put('/:companyId/:offerId/update')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.UPDATE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.UPDATE.OK)
  @ApiResponse(RES.UPDATE.BAD_REQUEST)
  @ApiResponse(RES.UPDATE.UNAUTHORIZED)
  @ApiResponse(RES.UPDATE.FORBIDDEN)
  @ApiResponse(RES.UPDATE.NOT_FOUND)
  @ApiResponse(RES.UPDATE.INTERNAL_SERVER_ERROR)
  updateOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() { userId }: JwtPayload,
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
  @ApiOperation(OPERATION.DELETE)
  @ApiBearerAuth()
  @ApiHeader(HEADER.ACCESS_TOKEN)
  @ApiParam(PARAM.COMPANY_ID)
  @ApiParam(PARAM.OFFER_ID)
  @ApiResponse(RES.DELETE.OK)
  @ApiResponse(RES.DELETE.BAD_REQUEST_PARAMS)
  @ApiResponse(RES.DELETE.UNAUTHORIZED)
  @ApiResponse(RES.DELETE.FORBIDDEN)
  @ApiResponse(RES.DELETE.NOT_FOUND)
  @ApiResponse(RES.DELETE.INTERNAL_SERVER_ERROR)
  deleteOffer(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('offerId', ParseIntPipe) offerId: number,
    @GetAccessTokenPayload() { userId }: JwtPayload,
  ): Promise<SuccessMessageDto> {
    return this.offerService.deleteOffer(companyId, offerId, userId);
  }
}
