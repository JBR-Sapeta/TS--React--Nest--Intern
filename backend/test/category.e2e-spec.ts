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

describe('CategoryController (e2e)', () => {
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
    await dataSource.destroy();
    await cacheService.shutdownConnection();
  });

  afterAll(async () => {
    await app.close();
  });

  // ------------------------------------  Helpers  -------------------------------------- \\

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendGetCategoriesRequest = async () => {
    const response = await request(app.getHttpServer())
      .get(`/categories`)
      .send();
    return response;
  };

  // --------------------------- GET CATEGORIES - Valid Request -------------------------- \\

  describe('/categories (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const response = await sendGetCategoriesRequest();
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const response = await sendGetCategoriesRequest();
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object with payload', async () => {
      const response = await sendGetCategoriesRequest();
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns categories data', async () => {
      const response = await sendGetCategoriesRequest();
      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'name',
        'parentId',
        'children',
      ]);
    });

    it('returns categories tree', async () => {
      const response = await sendGetCategoriesRequest();
      expect(Object.keys(response.body.data[0].children[0])).toEqual([
        'id',
        'name',
        'parentId',
        'children',
      ]);
    });
  });
});
