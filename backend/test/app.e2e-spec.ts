import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { CacheService } from './../src/cache/cache.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let cacheService: CacheService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    cacheService = moduleFixture.get<CacheService>(CacheService);

    await app.init();
  });

  afterEach(async () => {
    await cacheService.onApplicationShutdown();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
