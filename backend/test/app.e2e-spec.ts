import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { AppModule } from './../src/app.module';
import { CacheService } from './../src/cache/cache.service';
import { MailService } from './../src/mail/mail.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { S3Service } from './../src/s3/s3.service';

import { mailService } from './mocks/mail-service';
import { geocoderService } from './mocks/geocoder-service';

import { s3Service } from './mocks/s3-service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let cacheService: CacheService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mailService)
      .overrideProvider(GeocoderService)
      .useValue(geocoderService)
      .overrideProvider(S3Service)
      .useValue(s3Service)
      .compile();

    app = moduleFixture.createNestApplication();

    dataSource = moduleFixture.get(DataSource);
    cacheService = moduleFixture.get<CacheService>(CacheService);

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await dataSource.destroy();
    await cacheService.shutdownConnection();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
