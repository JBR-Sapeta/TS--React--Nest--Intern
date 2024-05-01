import {
  Body,
  Controller,
  Delete,
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

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';
import { SuccessMessageDto } from '../common/classes';

import { OfferService } from './offer.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/request';

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
