import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import {
  CompanyRepository,
  UserRepository,
  RoleRepository,
} from './../src/repository';

import { AppModule } from '../src/app/app.module';
import { CacheService } from './../src/cache/cache.service';
import { MailService } from './../src/mail/mail.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { AdminService } from './../src/admin/admin.service';
import { AuthService } from './../src/auth/auth.service';
import { CompanyService } from './../src/company/company.service';
import { BranchService } from './../src/branch/branch.service';
import { S3Service } from './../src/s3/s3.service';
import { mailService } from './mocks/mail-service';
import { geocoderService } from './mocks/geocoder-service';
import { s3Service } from './mocks/s3-service';

import {
  INVALID_ACCESS_TOKEN,
  RANDOM_UUID,
  USER_ONE,
  USER_THREE,
  USER_TWO,
} from './helpers/auth-data';
import { COMPANY_ONE, COMPANY_TWO } from './helpers/company-data';
import {
  COMPANY_ONE_BRANCHES,
  COMPANY_TWO_BRANCHES,
} from './helpers/branch-data';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let companyRepository: CompanyRepository;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;
  let adminService: AdminService;
  let authService: AuthService;
  let cacheService: CacheService;
  let companyService: CompanyService;
  let branchService: BranchService;

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

    companyRepository = moduleFixture.get<CompanyRepository>(CompanyRepository);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    roleRepository = moduleFixture.get<RoleRepository>(RoleRepository);
    cacheService = moduleFixture.get<CacheService>(CacheService);
    adminService = moduleFixture.get<AdminService>(AdminService);
    authService = moduleFixture.get<AuthService>(AuthService);
    companyService = moduleFixture.get<CompanyService>(CompanyService);
    branchService = moduleFixture.get<BranchService>(BranchService);

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    adminService.closeScheduledTaska();
    await dataSource.destroy();
    await cacheService.shutdownConnection();
  });

  afterAll(async () => {
    await app.close();
  });

  // ------------------------------------  Helpers  -------------------------------------- \\

  const createActiveUser = async (
    userData: any,
    isAdmin = false,
    hasBan = false,
  ) => {
    await authService.createUserAccount(userData);
    const user = await userRepository.findOne({
      where: { email: userData.email },
      relations: { roles: true },
    });
    user.activationToken = null;
    user.isActive = true;
    user.hasBan = hasBan;

    if (isAdmin) {
      const admiRole = await roleRepository.findOneBy({ name: 'admin' });
      user.roles = [...user.roles, admiRole];
    }
    const updatedUser = await userRepository.save(user);

    let accessToken = null;

    if (!hasBan) {
      const tokens = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      accessToken = tokens.data.accessToken;
    }

    return { user: updatedUser, accessToken };
  };

  const createUserAndCompany = async (
    userData: any,
    companyData: any,
    companyBranches: any,
    verified = true,
    hasBan = false,
  ) => {
    await authService.createUserAccount(userData);
    const user = await userRepository.findOne({
      where: { email: userData.email },
      relations: { roles: true },
    });
    user.activationToken = null;
    user.isActive = true;
    user.hasBan = hasBan;
    const updatedUser = await userRepository.save(user);

    await companyService.createCompany(updatedUser, companyData);
    const company = await companyRepository.getCompanyBySlug(companyData.slug);

    company.isVerified = verified;
    const updatedCompany = await companyRepository.save(company);

    // Create branches
    for (const branch of companyBranches) {
      await branchService.createBranch(company.id, updatedUser, branch);
    }

    return {
      user: updatedUser,
      company: updatedCompany,
    };
  };

  const getUserFromDB = async (userId: string) => {
    const user = await userRepository.findOne({
      where: { id: userId },
    });
    return user;
  };

  const getCompanyFromDB = async (companyId: string) => {
    const company = await companyRepository.findOne({
      where: { id: companyId },
    });
    return company;
  };

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendGetCompaniesRequest = async (token: string, params: any) => {
    const queryParams = Object.entries(params).map(
      ([key, value]) => `&${key}=${value}`,
    );

    const response = await request(app.getHttpServer())
      .get(`/admin/companies?${queryParams.join('')}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendGetLogsRequest = async (token: string, params: any) => {
    const queryParams = Object.entries(params).map(
      ([key, value]) => `&${key}=${value}`,
    );

    const response = await request(app.getHttpServer())
      .get(`/admin/logs?${queryParams.join('')}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendGetUsersRequest = async (token: string, params: any) => {
    const queryParams = Object.entries(params).map(
      ([key, value]) => `&${key}=${value}`,
    );

    const response = await request(app.getHttpServer())
      .get(`/admin/users?${queryParams.join('')}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendVerifyCompanyRequest = async (
    token: string,
    companyId: number | string,
  ) => {
    const response = await request(app.getHttpServer())
      .patch(`/admin/companies/${companyId}/is-verified`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendHasBanRequest = async (
    token: string,
    companyId: number | string,
  ) => {
    const response = await request(app.getHttpServer())
      .patch(`/admin/users/${companyId}/has-ban`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  // -------------------------- GET COMPANIES - Invalid Request -------------------------- \\
  describe('/admin/companies (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {});

      expect(response.status).toBe(200);
    });

    it('returns proper pagination object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {});

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
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
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {});

      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'name',
        'slug',
        'email',
        'phoneNumber',
        'logoUrl',
        'size',
        'isVerified',
        'owner',
      ]);
    });

    it('returns one element when limit is set to 1', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, { limit: 1 });

      expect(response.body.pageNumber).toBe(0);
      expect(response.body.limit).toBe(1);
    });

    it('returns second page when limit and page number is set to 1', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        limit: 1,
        pageNumber: 1,
      });

      expect(response.body.pageNumber).toBe(1);
    });

    it('returns two elements when isVerified param is set to true', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        isVerified: true,
      });

      expect(response.body.data.length).toBe(2);
    });

    it('returns no elements when isVerified param is set to false', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        isVerified: false,
      });

      expect(response.body.data.length).toBe(0);
    });

    it('returns owner data if owner param is set to true', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        owner: true,
      });

      expect(Object.keys(response.body.data[0].owner)).toEqual([
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'hasBan',
        'isActive',
        'createdAt',
      ]);
    });

    it('returns null as owner data if owner param is set to false', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        owner: false,
      });

      expect(response.body.data[0].owner).toBe(null);
    });

    it('returns one element when name email is set', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        email: COMPANY_ONE.email,
      });

      expect(response.body.data.length).toBe(1);
    });

    it('returns one element when name slug is set', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        slug: COMPANY_ONE.slug,
      });

      expect(response.body.data.length).toBe(1);
    });

    it('returns one element when name param is set', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        name: COMPANY_ONE.name,
      });

      expect(response.body.data.length).toBe(1);
    });
  });

  // -------------------------- GET COMPANIES - Invalid Request -------------------------- \\

  describe('/admin/companies (GET) - Invalid Request', () => {
    it('returns 400 status code when provided params are invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {
        pageNumber: -10,
      });

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      await createActiveUser(USER_ONE, true);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(INVALID_ACCESS_TOKEN, {});

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user has not admin role', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, false);
      await createUserAndCompany(USER_TWO, COMPANY_ONE, COMPANY_ONE_BRANCHES);
      await createUserAndCompany(USER_THREE, COMPANY_TWO, COMPANY_TWO_BRANCHES);

      const response = await sendGetCompaniesRequest(accessToken, {});

      expect(response.status).toBe(403);
    });
  });

  // ----------------------------- GET Logs - Valid Request ------------------------------ \\

  describe('/admin/logs (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);

      const response = await sendGetLogsRequest(accessToken, {});

      expect(response.status).toBe(200);
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);

      const response = await sendGetLogsRequest(accessToken, {});

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns buckets and und unknown exceptions', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);

      const response = await sendGetLogsRequest(accessToken, {});

      expect(Object.keys(response.body.data)).toEqual([
        'buckets',
        'unknownExceptions',
      ]);
    });
  });

  // ---------------------------- GET Logs - Invalid Request ----------------------------- \\

  describe('/admin/logs (GET) - Invalid Request', () => {
    it('returns 400 status code when provided params are invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);

      const response = await sendGetLogsRequest(accessToken, {
        startDate: 'sadad',
      });

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      await createActiveUser(USER_ONE, true);

      const response = await sendGetLogsRequest(INVALID_ACCESS_TOKEN, {});

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user has not admin role', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, false);

      const response = await sendGetLogsRequest(accessToken, {});

      expect(response.status).toBe(403);
    });
  });

  // ----------------------------- GET USERS - Valid Request ----------------------------- \\

  describe('/admin/users (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {});

      expect(response.status).toBe(200);
    });

    it('returns proper pagination object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {});

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'limit',
        'pageNumber',
        'hasNextPage',
        'totalPages',
        'data',
      ]);
    });

    it('returns user data', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {});

      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'hasBan',
        'isActive',
        'createdAt',
      ]);
    });

    it('returns one element when limit is set to 1', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, { limit: 1 });

      expect(response.body.pageNumber).toBe(0);
      expect(response.body.limit).toBe(1);
    });

    it('returns second page when limit and page number is set to 1', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        limit: 1,
        pageNumber: 1,
      });

      expect(response.body.pageNumber).toBe(1);
      expect(response.body.limit).toBe(1);
    });

    it('returns one element when firstName param is set', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        firstName: USER_TWO.firstName,
      });

      expect(response.body.data.length).toBe(1);
    });

    it('returns one element when lastName param is set', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        lastName: USER_TWO.lastName,
      });

      expect(response.body.data.length).toBe(1);
    });

    it('returns one element when email param is set', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        email: USER_TWO.email,
      });

      expect(response.body.data.length).toBe(1);
    });

    it('returns one element when hasBan param is set to false', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        hasBan: false,
      });

      expect(response.body.data.length).toBe(3);
    });

    it('returns one element when hasBan param is set to true', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        hasBan: true,
      });

      expect(response.body.data.length).toBe(0);
    });
  });

  // ---------------------------- GET USERS - Invalid Request ---------------------------- \\

  describe('/admin/users (GET) - Invalid Request', () => {
    it('returns 400 status code when provided params are invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {
        limit: -100,
      });

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(INVALID_ACCESS_TOKEN, {});

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user has not admin role', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, false);
      await createActiveUser(USER_TWO);
      await createActiveUser(USER_THREE);

      const response = await sendGetUsersRequest(accessToken, {});

      expect(response.status).toBe(403);
    });
  });

  // -------------------------- VERIFY COMPANY - Valid Request --------------------------- \\

  describe('/companies/:companyId/is-verified (PATCH) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(accessToken, company.id);

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(accessToken, company.id);

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(accessToken, company.id);

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('changes isVerified property to true if comopany is not verified', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      await sendVerifyCompanyRequest(accessToken, company.id);
      const updatedCompany = await getCompanyFromDB(company.id);

      expect(company.isVerified).toBe(false);
      expect(updatedCompany.isVerified).toBe(true);
    });

    it('changes isVerified property to false if comopany is verified', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        true,
      );

      await sendVerifyCompanyRequest(accessToken, company.id);
      const updatedCompany = await getCompanyFromDB(company.id);

      expect(company.isVerified).toBe(true);
      expect(updatedCompany.isVerified).toBe(false);
    });
  });

  // ------------------------- VERIFY COMPANY - Invalid Request -------------------------- \\

  describe('/companies/:companyId/is-verified (PATCH) - Valid Request', () => {
    it('returns 400 status code when companyId  param is invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(
        accessToken,
        'INVALID_COMPANY_ID',
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      await createActiveUser(USER_ONE, true);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(
        INVALID_ACCESS_TOKEN,
        company.id,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user has not admin role', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, false);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(accessToken, company.id);

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when company owner has been banned', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const { company } = await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
        true,
      );

      const response = await sendVerifyCompanyRequest(accessToken, company.id);

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company with provided id does not exist', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createUserAndCompany(
        USER_TWO,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        false,
      );

      const response = await sendVerifyCompanyRequest(accessToken, RANDOM_UUID);

      expect(response.status).toBe(404);
    });
  });

  // ----------------------------- BAN USER - Valid Request ------------------------------ \\

  describe('/users/:companyId/is-verified (PATCH) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(accessToken, user.id);

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(accessToken, user.id);

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(accessToken, user.id);

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('changes hasBan property to true if user is not banned', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO);

      await sendHasBanRequest(accessToken, user.id);

      const updatedUser = await getUserFromDB(user.id);

      expect(user.hasBan).toBe(false);
      expect(updatedUser.hasBan).toBe(true);
    });

    it('changes hasBan property to false if user has already a ban', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO, false, true);

      await sendHasBanRequest(accessToken, user.id);

      const updatedUser = await getUserFromDB(user.id);

      expect(user.hasBan).toBe(true);
      expect(updatedUser.hasBan).toBe(false);
    });
  });

  // ---------------------------- BAN USER - Invalid Request ----------------------------- \\

  describe('/companies/:companyId/is-verified (PATCH) - Valid Request', () => {
    it('returns 400 status code when companyId  param is invalid', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(
        accessToken,
        'INVALID_COMPANY_ID',
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(INVALID_ACCESS_TOKEN, user.id);

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user has not admin role', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const { user } = await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(accessToken, user.id);

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when user want to ban another admin', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      const { user } = await createActiveUser(USER_TWO, true);

      const response = await sendHasBanRequest(accessToken, user.id);

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when user want ban yourself', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE, true);

      const response = await sendHasBanRequest(accessToken, user.id);

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when user with provided id does not exist', async () => {
      const { accessToken } = await createActiveUser(USER_ONE, true);
      await createActiveUser(USER_TWO);

      const response = await sendHasBanRequest(accessToken, RANDOM_UUID);

      expect(response.status).toBe(404);
    });
  });
});
