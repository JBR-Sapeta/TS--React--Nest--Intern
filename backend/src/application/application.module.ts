import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ApplicationEntity,
  CompanyEntity,
  OfferEntity,
  UserEntity,
} from '../entity';

import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../cache/cache.service';
import { S3Service } from '../s3/s3.service';

import { ApplicationRepository, OfferRepository } from '../repository';

import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ApplicationEntity,
      CompanyEntity,
      OfferEntity,
      UserEntity,
    ]),
  ],
  controllers: [ApplicationController],
  providers: [
    Logger,
    ApplicationService,
    CacheService,
    S3Service,
    ApplicationRepository,
    OfferRepository,
  ],
})
export class ApplicationModule {}
