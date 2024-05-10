import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ENV_KEYS } from './common/constants';
import type { DatabaseConfigType } from './common/config';
import { exceptionFactory } from './common/functions';

import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { CacheModule } from './cache/cache.module';
import { CompanyModule } from './company/company.module';
import { GeocoderModule } from './geocoder/geocoder.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { OfferModule } from './offer/offer.module';
import { ApplicationModule } from './application/application.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    AuthModule,
    ApplicationModule,
    CacheModule,
    CategoryModule,
    CompanyModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    BranchModule,
    GeocoderModule,
    MailModule,
    OfferModule,
    UserModule,
    S3Module,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        let testConfig = {};
        if (process.env.NODE_ENV === 'test') {
          testConfig = {
            synchronize: true,
            dropSchema: true,
            logging: false,
          };
        }

        return {
          type: config.get<DatabaseConfigType>(ENV_KEYS.DB_TYPE),
          host: config.get<string>(ENV_KEYS.DB_HOST),
          port: +config.get<string>(ENV_KEYS.DB_PORT),
          username: config.get<string>(ENV_KEYS.DB_USER),
          password: config.get<string>(ENV_KEYS.DB_PASSWORD),
          database: config.get<string>(ENV_KEYS.DB_NAME),
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: process.env.NODE_ENV !== 'prod',
          autoLoadEntities: true,
          ...testConfig,
        };
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new ClassSerializerInterceptor(new Reflector(), {
        strategy: 'excludeAll',
      }),
    },
  ],
})
export class AppModule {}
