import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { CompanyRepository, UserRepository } from './../src/repositories';

import { AppModule } from './../src/app.module';

import { MailService } from './../src/mail/mail.service';
import { CacheService } from './../src/cache/cache.service';
import { AuthService } from './../src/auth/auth.service';

import { mailService } from './mocks/mail-service';

import { INVALID_ACCESS_TOKEN, USER_ONE, USER_TWO } from './helpers/auth-data';
import {
  COMPANY_ONE,
  COMPANY_TWO,
  INVALID_COMPANY,
  INVALID_COMPANY_ID,
} from './helpers/company-data';

describe('CompanyController', () => {
  let app: INestApplication;
  let cacheService: CacheService;
  let userRepository: UserRepository;
  let companyRepository: CompanyRepository;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mailService)
      .compile();

    app = moduleFixture.createNestApplication();

    cacheService = moduleFixture.get<CacheService>(CacheService);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    companyRepository = moduleFixture.get<CompanyRepository>(CompanyRepository);
    authService = moduleFixture.get<AuthService>(AuthService);

    await app.init();
  });

  afterEach(async () => {
    await cacheService.onApplicationShutdown();
  });

  afterAll(async () => {
    await app.close();
  });

  // ------------------------------------  Helpers  ------------------------------------- \\

  const createActiveUser = async (userData: any) => {
    await authService.createUserAccount(userData);
    const user = await userRepository.findOne({
      where: { email: userData.email },
      relations: { roles: true },
    });
    user.activationToken = null;
    user.isActive = true;

    const updatedUser = await userRepository.save(user);
    const tokens = await authService.login({
      email: userData.email,
      password: userData.password,
    });
    return { user: updatedUser, accessToken: tokens.data.accessToken };
  };

  const getCompanyByNameFromDB = async (name: string) => {
    const company = await companyRepository.findOne({
      where: { name },
    });
    return company;
  };

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendCreateCompanyRequest = async (token: string, data: any) => {
    const response = await request(app.getHttpServer())
      .post('/companies/create')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendGetCompanyBySlugRequest = async (slug: string) => {
    const response = await request(app.getHttpServer())
      .get(`/companies/${slug}`)
      .send();
    return response;
  };

  const sendGetCompaniesRequest = async (pageNumber: any, limit: any) => {
    const response = await request(app.getHttpServer())
      .get(`/companies?pageNumber=${pageNumber}&limit=${limit}`)
      .send();
    return response;
  };

  const sendUpdateCompanyRequest = async (
    token: string,
    comapnyId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .put(`/companies/${comapnyId}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendDeleteCompanyRequest = async (token: string, comapnyId: string) => {
    const response = await request(app.getHttpServer())
      .delete(`/companies/${comapnyId}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  // ------------------------------- CREATE - Valid Request ------------------------------ \\

  describe('/companies/create (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      expect(response.status).toBe(201);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('creates new company in database', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      expect(company).toBeTruthy();
    });
  });

  // ------------------------------ CREATE - Invalid Request ----------------------------- \\

  describe('/companies/create (POST) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendCreateCompanyRequest(
        accessToken,
        INVALID_COMPANY,
      );
      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'name'}
      ${'slug'}
      ${'email'}
      ${'description'}
      ${'size'}
    `(
      'returns proper error message when $invalidField is invalid',
      async ({ invalidField }) => {
        const { accessToken } = await createActiveUser(USER_ONE);
        const company = { ...COMPANY_ONE };
        company[invalidField] = INVALID_COMPANY[invalidField];
        const response = await sendCreateCompanyRequest(accessToken, company);
        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendCreateCompanyRequest(
        INVALID_ACCESS_TOKEN,
        COMPANY_ONE,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user already has a company', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendCreateCompanyRequest(accessToken, COMPANY_TWO);
      expect(response.status).toBe(403);
    });

    it.each`
      field
      ${'name'}
      ${'slug'}
    `('returns error when $field is already taken', async ({ field }) => {
      const { accessToken: tokenOne } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(tokenOne, COMPANY_ONE);
      const { accessToken: tokenTwo } = await createActiveUser(USER_TWO);
      const company = { ...COMPANY_TWO };
      company[field] = COMPANY_ONE[field];
      const response = await sendCreateCompanyRequest(tokenTwo, company);
      expect(response.status).not.toBe(201);
    });
  });

  // ------------------------ GET COMPANY BY SLUG - Valid Request ------------------------ \\

  describe('/companies/:slug (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompanyBySlugRequest(COMPANY_ONE.slug);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompanyBySlugRequest(COMPANY_ONE.slug);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompanyBySlugRequest(COMPANY_ONE.slug);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns company data', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompanyBySlugRequest(COMPANY_ONE.slug);
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'slug',
        'email',
        'phoneNumber',
        'logoUrl',
        'mainPhotoUrl',
        'description',
        'size',
        'isVerfied',
      ]);
    });
  });

  // ----------------------- GET COMPANY BY SLUG - Invalid Request ----------------------- \\

  describe('/companies/:slug (GET) - Invalid Request', () => {
    it('returns 404 status when company does not exist', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendGetCompanyBySlugRequest(COMPANY_ONE.slug);
      expect(response.status).toBe(404);
    });
  });

  // --------------------------- GET COMPANIES - Valid Request --------------------------- \\

  describe('/companies (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest(0, 12);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest(0, 12);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest(0, 12);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
        'limit',
        'pageNumber',
        'hasNextPage',
        'totalPages',
        'data',
      ]);
    });

    it('returns company data', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest(0, 12);
      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'name',
        'slug',
        'email',
        'phoneNumber',
        'logoUrl',
        'mainPhotoUrl',
        'description',
        'size',
        'isVerfied',
      ]);
    });

    it('returns empty array when page is out of the range', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest(100, 12);
      expect(response.body.data).toEqual([]);
    });
  });

  // -------------------------- GET COMPANIES - Invalid Request -------------------------- \\

  describe('/companies (GET) - Invalid Request', () => {
    it('returns 400 status when query params are invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest('page', 'limit');
      expect(response.status).toBe(400);
    });
  });

  // ------------------------------- UPDATE - Valid Request ------------------------------ \\

  describe('/companies/:companyId/update (PUT) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(
        accessToken,
        company.id,
        COMPANY_TWO,
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(
        accessToken,
        company.id,
        COMPANY_TWO,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(
        accessToken,
        company.id,
        COMPANY_TWO,
      );
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('updates company in database', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      await sendUpdateCompanyRequest(accessToken, company.id, COMPANY_TWO);
      const updatedCompany = await getCompanyByNameFromDB(COMPANY_TWO.name);
      expect(updatedCompany).toBeTruthy();
    });
  });

  // ------------------------------ UPDATE - Invalid Request ----------------------------- \\

  describe('/companies/:companyId/update (PUT) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(
        accessToken,
        company.id,
        INVALID_COMPANY,
      );
      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'name'}
      ${'slug'}
      ${'email'}
      ${'description'}
      ${'size'}
    `(
      'returns proper error message when $invalidField is invalid',
      async ({ invalidField }) => {
        const { accessToken } = await createActiveUser(USER_ONE);
        await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
        const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
        const companyBody = { ...COMPANY_TWO };
        companyBody[invalidField] = INVALID_COMPANY[invalidField];
        const response = await sendUpdateCompanyRequest(
          accessToken,
          company.id,
          companyBody,
        );
        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(
        INVALID_ACCESS_TOKEN,
        company.id,
        COMPANY_TWO,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when request is sent for the company of another user', async () => {
      const { accessToken: tokenOne } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(tokenOne, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const { accessToken: tokenTwo } = await createActiveUser(USER_TWO);
      const response = await sendUpdateCompanyRequest(
        tokenTwo,
        company.id,
        COMPANY_TWO,
      );
      expect(response.status).toBe(403);
    });

    it('returns 404 when provided companyId is invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendUpdateCompanyRequest(
        accessToken,
        INVALID_COMPANY_ID,
        COMPANY_TWO,
      );
      expect(response.status).toBe(404);
    });

    it.each`
      field
      ${'name'}
      ${'slug'}
    `('returns error when $field is already taken', async ({ field }) => {
      const { accessToken: tokenOne } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(tokenOne, COMPANY_ONE);
      const { accessToken: tokenTwo } = await createActiveUser(USER_TWO);
      await sendCreateCompanyRequest(tokenTwo, COMPANY_TWO);
      const company = await getCompanyByNameFromDB(COMPANY_TWO.name);
      const companyBody = { ...COMPANY_TWO };
      companyBody[field] = COMPANY_ONE[field];
      const response = await sendUpdateCompanyRequest(
        tokenTwo,
        company.id,
        companyBody,
      );
      expect(response.status).not.toBe(201);
    });
  });

  // ------------------------------- DELETE - Valid Request ------------------------------ \\

  describe('/companies/:companyId/delete (DELETE) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendDeleteCompanyRequest(accessToken, company.id);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendDeleteCompanyRequest(accessToken, company.id);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendDeleteCompanyRequest(accessToken, company.id);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('deletes company in database', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      await sendDeleteCompanyRequest(accessToken, company.id);
      const deleteCompany = await getCompanyByNameFromDB(COMPANY_ONE.name);
      expect(deleteCompany).toBe(null);
    });
  });

  // ------------------------------ DELETE - Invalid Request ----------------------------- \\

  describe('/companies/:companyId/delete (DELETE) - Invalid Request', () => {
    it('returns 400 status when companyId param is not uuid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendDeleteCompanyRequest(
        accessToken,
        'invalidparam',
      );
      expect(response.status).toBe(400);
    });

    it('returns 401 status code when access token is invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendDeleteCompanyRequest(
        INVALID_ACCESS_TOKEN,
        company.id,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when request is sent for the company of another user', async () => {
      const { accessToken: tokenOne } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(tokenOne, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const { accessToken: tokenTwo } = await createActiveUser(USER_TWO);
      const response = await sendDeleteCompanyRequest(tokenTwo, company.id);
      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company does not exist', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendDeleteCompanyRequest(
        accessToken,
        INVALID_COMPANY_ID,
      );
      expect(response.status).toBe(404);
    });
  });
});
