import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccessTokenGuard } from '../auth/guards';
import { GetAccessTokenPayload } from '../auth/decorators';
import { SuccessMessageDto } from '../common/classes';

import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/request';

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
}
