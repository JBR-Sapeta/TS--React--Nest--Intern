import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ENV_KEYS } from './utils/constants';
import { DatabaseConfigType } from './utils/types';

import { UserModule } from './user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<DatabaseConfigType>(ENV_KEYS.DB_TYPE),
          host: config.get<string>(ENV_KEYS.DB_HOST),
          port: +config.get<string>(ENV_KEYS.DB_PORT),
          username: config.get<string>(ENV_KEYS.DB_USER),
          password: config.get<string>(ENV_KEYS.DB_PASSWORD),
          database: config.get<string>(ENV_KEYS.DB_NAME),
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: process.env.NODE_ENV === 'development',
          autoLoadEntities: true,
        };
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
