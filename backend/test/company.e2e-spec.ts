import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException, INestApplication } from '@nestjs/common';
import path = require('path');
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { OfferEntity } from './../src/entities';

import {
  ApplicationRepository,
  BranchRepository,
  CompanyRepository,
  OfferRepository,
  UserRepository,
} from './../src/repositories';

import { Roles } from './../src/common/enums';

import { AppModule } from './../src/app.module';

import { AuthService } from './../src/auth/auth.service';
import { CacheService } from './../src/cache/cache.service';
import { CompanyService } from './../src/company/company.service';
import { BranchService } from './../src/branch/branch.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { MailService } from './../src/mail/mail.service';
import { OfferService } from './../src/offer/offer.service';
import { S3Service } from './../src/s3/s3.service';

import { INVALID_ACCESS_TOKEN, USER_ONE, USER_TWO } from './helpers/auth-data';
import { FILE_KEY } from './helpers/application-data';
import {
  COMPANY_ONE,
  COMPANY_ONE_LOGO_URL,
  COMPANY_ONE_MAIN_PHOTO_URL,
  COMPANY_TWO,
  FILES,
  INVALID_CATEGOREIS,
  INVALID_COMPANY,
  INVALID_COMPANY_ID,
} from './helpers/company-data';
import { COMPANY_ONE_BRANCHES } from './helpers/branch-data';
import { COMPANY_ONE_OFFERS } from './helpers/offer-data';

import { geocoderService } from './mocks/geocoder-service';
import { mailService } from './mocks/mail-service';
import { s3Service } from './mocks/s3-service';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authService: AuthService;
  let cacheService: CacheService;
  let companyService: CompanyService;
  let branchService: BranchService;
  let offerService: OfferService;
  let applicationRepository: ApplicationRepository;
  let companyRepository: CompanyRepository;
  let branchRepository: BranchRepository;
  let offerRepository: OfferRepository;
  let userRepository: UserRepository;

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
    authService = moduleFixture.get<AuthService>(AuthService);
    cacheService = moduleFixture.get<CacheService>(CacheService);
    companyService = moduleFixture.get<CompanyService>(CompanyService);
    branchService = moduleFixture.get<BranchService>(BranchService);
    offerService = moduleFixture.get<OfferService>(OfferService);
    applicationRepository = moduleFixture.get<ApplicationRepository>(
      ApplicationRepository,
    );
    branchRepository = moduleFixture.get<BranchRepository>(BranchRepository);
    companyRepository = moduleFixture.get<CompanyRepository>(CompanyRepository);
    offerRepository = moduleFixture.get<OfferRepository>(OfferRepository);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);

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

  const createUserWithCompany = async (
    userData: any,
    companyData: any,
    withLogo: boolean = false,
    withMainPhoto: boolean = false,
  ) => {
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

    await companyService.createCompany(updatedUser, companyData);
    const company = await companyRepository.getCompanyBySlug(companyData.slug);

    company.isVerified = true;

    if (withLogo) {
      company.logoUrl = COMPANY_ONE_LOGO_URL;
    }

    if (withMainPhoto) {
      company.mainPhotoUrl = COMPANY_ONE_MAIN_PHOTO_URL;
    }

    await companyRepository.save(company);

    return {
      user: updatedUser,
      accessToken: tokens.data.accessToken,
      companyId: company.id,
      company,
    };
  };

  const createUserAndCompanyWithOffers = async (
    userData: any,
    companyData: any,
    companyBranches: any,
    offersData: any,
  ) => {
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

    await companyService.createCompany(updatedUser, companyData);
    const company = await companyRepository.getCompanyBySlug(companyData.slug);

    company.isVerified = true;
    await companyRepository.save(company);

    // Create branches
    let branches = [];

    for (const branch of companyBranches) {
      await branchService.createBranch(company.id, updatedUser, branch);
    }

    const createdBranches = await branchRepository.find({
      where: { companyId: company.id },
    });
    branches = createdBranches;

    // Create offers
    for (let i = 0; i < offersData.length; i++) {
      const offer = { ...offersData[i], branches: [branches[i].id] };
      await offerService.createOffer(company.id, user.id, offer);
    }

    const offers = await offerRepository.find({
      where: { companyId: company.id },
    });

    return {
      accessToken: tokens.data.accessToken,
      user: updatedUser,
      offers,
      companyId: company.id,
    };
  };

  const createUserWithApplications = async (
    userData: any,
    offers: OfferEntity[],
  ) => {
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

    const accessToken = tokens.data.accessToken;

    const applications = [];

    for (const offer of offers) {
      const application = await applicationRepository.create({
        message: null,
        fileKey: FILE_KEY,
        user: updatedUser,
        offer,
      });

      const createdApplication = await applicationRepository.save(application);
      applications.push(createdApplication);
    }

    return {
      user: updatedUser,
      accessToken,
      applications,
    };
  };

  const getCompanyByNameFromDB = async (name: string) => {
    const company = await companyRepository.findOne({
      where: { name },
    });
    return company;
  };

  const getUserFromDB = async (userId: string) => {
    const user = await userRepository.findOne({
      where: { id: userId },
    });
    return user;
  };

  const getUserApplicationsFromDB = async (userId: string) => {
    const applications = await applicationRepository.find({
      where: { userId },
    });
    return applications;
  };

  const getCompanyBranchesFromDB = async (companyId: string) => {
    const branches = await branchRepository.find({
      where: { companyId },
    });
    return branches;
  };

  const getCompanyOffersFromDB = async (companyId: string) => {
    const offers = await offerRepository.find({
      where: { companyId },
    });
    return offers;
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

  const sendUploadCompanyImagesRequest = async (
    token: string,
    comapnyId: string,
    logoFile: string,
    mainPhoto: string,
  ) => {
    const response = await request(app.getHttpServer())
      .put(`/companies/${comapnyId}/upload-images`)
      .set('Authorization', `Bearer ${token}`)
      .attach('logoFile', path.join('.', 'test', 'resources', logoFile))
      .attach('mainPhotoFile', path.join('.', 'test', 'resources', mainPhoto));

    return response;
  };

  const sendUploadCompanyImageRequest = async (
    token: string,
    comapnyId: string,
    fileKey?: string,
    fileName?: string,
  ) => {
    if (fileKey && fileName) {
      const response = await request(app.getHttpServer())
        .put(`/companies/${comapnyId}/upload-images`)
        .set('Authorization', `Bearer ${token}`)
        .attach(fileKey, path.join('.', 'test', 'resources', fileName));

      return response;
    }

    const response = await request(app.getHttpServer())
      .put(`/companies/${comapnyId}/upload-images`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendResetCompanyImagesRequest = async (
    token: string,
    comapnyId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .put(`/companies/${comapnyId}/reset-images`)
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
        'statusCode',
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

    it('changes user role into company role', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);

      const { roles } = await getUserFromDB(user.id);
      const userRoles = roles.map((role) => role.id);

      expect(userRoles.includes(Roles.COMPANY)).toBeTruthy();
      expect(userRoles.includes(Roles.USER)).toBeFalsy();
    });

    it('deletes user applications from database', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { accessToken, user } = await createUserWithApplications(
        USER_TWO,
        offers,
      );

      const applicationsBefore = await getUserApplicationsFromDB(user.id);

      await sendCreateCompanyRequest(accessToken, COMPANY_TWO);

      const applicationsAfter = await getUserApplicationsFromDB(user.id);

      expect(applicationsBefore).not.toEqual([]);
      expect(applicationsAfter).toEqual([]);
    });

    it('calls s3 Service to delete applications files', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { accessToken } = await createUserWithApplications(
        USER_TWO,
        offers,
      );

      const deleteApplicationFile = jest.spyOn(
        s3Service,
        'deleteApplicationFile',
      );

      await sendCreateCompanyRequest(accessToken, COMPANY_TWO);

      expect(deleteApplicationFile).toHaveBeenCalledTimes(2);
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

    it('returns a 403 status code when user already has a company', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendCreateCompanyRequest(accessToken, COMPANY_TWO);
      expect(response.status).toBe(403);
    });

    it('returns a 404 status code when the provided categories do not exist', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);

      const response = await sendCreateCompanyRequest(accessToken, {
        ...COMPANY_ONE,
        categories: INVALID_CATEGOREIS,
      });

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
        'statusCode',
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
        'isVerified',
        'categories',
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
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const response = await sendGetCompaniesRequest(0, 12);
      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'name',
        'slug',
        'logoUrl',
        'size',
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
        'statusCode',
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

    it('returns 400 status code when empty object is provided as body', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(
        accessToken,
        company.id,
        {},
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

    it('returns 404 status code when the provided categories do not exist', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);
      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);
      const response = await sendUpdateCompanyRequest(accessToken, company.id, {
        ...COMPANY_TWO,
        categories: INVALID_CATEGOREIS,
      });
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

  // --------------------------- UPLOAD IMAGES - Valid Request --------------------------- \\

  describe('/companies/:companyId/upload-images (PUT) - Valid Request', () => {
    it('returns 200 status code when request contains multiple images', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_JPG,
        FILES.VALID_LOGO_JPG,
      );

      expect(response.status).toBe(200);
    });

    it('returns 200 status code when request contains JPG image', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImageRequest(
        accessToken,
        companyId,
        'logoFile',
        FILES.VALID_LOGO_JPG,
      );

      expect(response.status).toBe(200);
    });

    it('returns 200 status code when request contains PNG image', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImageRequest(
        accessToken,
        companyId,
        'logoFile',
        FILES.VALID_LOGO_PNG,
      );

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('saves images url in database', async () => {
      const { accessToken, companyId, company } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      const updatedCompany = await getCompanyByNameFromDB(company.name);

      expect(updatedCompany.logoUrl).not.toBe(company.logoUrl);
      expect(updatedCompany.mainPhotoUrl).not.toBe(company.mainPhotoUrl);
    });

    it('calls s3 service to upload image files', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const uploadImageFile = jest.spyOn(s3Service, 'uploadImageFile');

      await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(uploadImageFile).toHaveBeenCalledTimes(2);
    });
  });

  // -------------------------- UPLOAD IMAGES - Invalid Request -------------------------- \\

  describe('/companies/:companyId/upload-images (PUT) - Invalid Request', () => {
    it('returns 400 status code when query param is invalid', async () => {
      const { accessToken } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        'companyId',
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when request does not contains images', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImageRequest(
        accessToken,
        companyId,
        undefined,
        undefined,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when request contains logo bigger than 0.5MB', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImageRequest(
        accessToken,
        companyId,
        'logoFile',
        FILES.INVALID_LOGO_JPG,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when request contains main photo bigger than 1.5MB', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImageRequest(
        accessToken,
        companyId,
        'mainPhotoFile',
        FILES.INVALID_MAIN_JPG,
      );

      expect(response.status).toBe(400);
    });

    // it('returns 400 status code when request contains logo with incorrect mime type', async () => {
    //   const { accessToken, companyId } = await createUserWithCompany(
    //     USER_ONE,
    //     COMPANY_ONE,
    //   );

    //   const response = await sendUploadCompanyImageRequest(
    //     accessToken,
    //     companyId,
    //     'logoFile',
    //     FILES.INVALID_LOGO_AVIF,
    //   );

    //   expect(response.status).toBe(400);
    // });

    // it('returns 400 status code when request contains main photo with incorrect mime type', async () => {
    //   const { accessToken, companyId } = await createUserWithCompany(
    //     USER_ONE,
    //     COMPANY_ONE,
    //   );

    //   const response = await sendUploadCompanyImageRequest(
    //     accessToken,
    //     companyId,
    //     'mainPhotoFile',
    //     FILES.INVALID_MAIN_AVIF,
    //   );

    //   expect(response.status).toBe(400);
    // });

    it('returns 403 status code when company belongs to other user', async () => {
      const { companyId } = await createUserWithCompany(USER_ONE, COMPANY_ONE);

      const { accessToken } = await createUserWithCompany(
        USER_TWO,
        COMPANY_TWO,
      );

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company with provided id does not exist', async () => {
      const { accessToken } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        INVALID_COMPANY_ID,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(response.status).toBe(404);
    });

    it('returns 502 status code when file upload fail', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      jest
        .spyOn(s3Service, 'uploadImageFile')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });

      const response = await sendUploadCompanyImagesRequest(
        accessToken,
        companyId,
        FILES.VALID_LOGO_PNG,
        FILES.VALID_MAIN_PNG,
      );

      expect(response.status).toBe(502);
    });
  });

  // ---------------------------- RESET IMAGES - Valid Request --------------------------- \\

  describe('/companies/:companyId/reset-images (PUT) - Valid Request', () => {
    it('returns 200 status code when request contains two image fields', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        { logoUrl: true, mainPhotoUrl: false },
      );

      expect(response.status).toBe(200);
    });

    it('returns 200 status code when request contains one image field', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        { logoUrl: true },
      );

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        { logoUrl: true, mainPhotoUrl: false },
      );

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        { logoUrl: true, mainPhotoUrl: false },
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('sets logoUrl field to null in database when logoUrl is set to true in request body ', async () => {
      const { accessToken, companyId, company } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      await sendResetCompanyImagesRequest(accessToken, companyId, {
        logoUrl: true,
      });
      const updatedCompany = await getCompanyByNameFromDB(company.name);

      expect(updatedCompany.logoUrl).not.toBe(company.logoUrl);
      expect(updatedCompany.logoUrl).toBe(null);
      expect(updatedCompany.mainPhotoUrl).toBe(company.mainPhotoUrl);
      expect(updatedCompany.mainPhotoUrl).not.toBe(null);
    });

    it('sets mainPhotoUrl field to null in database when mainPhotoUrl is set to true in request body ', async () => {
      const { accessToken, companyId, company } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      await sendResetCompanyImagesRequest(accessToken, companyId, {
        mainPhotoUrl: true,
      });
      const updatedCompany = await getCompanyByNameFromDB(company.name);

      expect(updatedCompany.logoUrl).toBe(company.logoUrl);
      expect(updatedCompany.logoUrl).not.toBe(null);
      expect(updatedCompany.mainPhotoUrl).not.toBe(company.mainPhotoUrl);
      expect(updatedCompany.mainPhotoUrl).toBe(null);
    });

    it('sets image fields to null in database when both fileds are sets to true in request body', async () => {
      const { accessToken, companyId, company } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      await sendResetCompanyImagesRequest(accessToken, companyId, {
        logoUrl: true,
        mainPhotoUrl: true,
      });
      const updatedCompany = await getCompanyByNameFromDB(company.name);

      expect(updatedCompany.logoUrl).not.toBe(company.logoUrl);
      expect(updatedCompany.logoUrl).toBe(null);
      expect(updatedCompany.mainPhotoUrl).not.toBe(company.mainPhotoUrl);
      expect(updatedCompany.mainPhotoUrl).toBe(null);
    });

    it('calls s3 service to delete image files', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );
      const deleteImageFile = jest.spyOn(s3Service, 'deleteImageFile');

      await sendResetCompanyImagesRequest(accessToken, companyId, {
        logoUrl: true,
        mainPhotoUrl: true,
      });

      expect(deleteImageFile).toHaveBeenCalledTimes(2);
    });

    it('does not call s3 service to delete files when images does not exists', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        false,
        false,
      );
      const deleteImageFile = jest.spyOn(s3Service, 'deleteImageFile');

      await sendResetCompanyImagesRequest(accessToken, companyId, {
        logoUrl: true,
        mainPhotoUrl: true,
      });

      expect(deleteImageFile).toHaveBeenCalledTimes(0);
    });
  });

  // --------------------------- RESET IMAGES - Invalid Request -------------------------- \\

  describe('/companies/:companyId/reset-images (PUT) - Invalid Request', () => {
    it('returns 400 status code when query param is invalid', async () => {
      const { accessToken } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        'companyId',
        { logoUrl: true, mainPhotoUrl: true },
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when request contains empty object as request body', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        {},
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when request contains both fields set to false', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        { logoUrl: false, mainPhotoUrl: false },
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      const { companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        { logoUrl: false, mainPhotoUrl: false },
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company belongs to other user', async () => {
      const { companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const { accessToken } = await createUserWithCompany(
        USER_TWO,
        COMPANY_TWO,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        companyId,
        { logoUrl: true, mainPhotoUrl: true },
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company with provided id does not exist', async () => {
      const { accessToken } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );

      const response = await sendResetCompanyImagesRequest(
        accessToken,
        INVALID_COMPANY_ID,
        { logoUrl: true, mainPhotoUrl: false },
      );

      expect(response.status).toBe(404);
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
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('changes company role into user role', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);

      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);

      await sendDeleteCompanyRequest(accessToken, company.id);

      const { roles } = await getUserFromDB(user.id);
      const userRoles = roles.map((role) => role.id);

      expect(userRoles.includes(Roles.USER)).toBeTruthy();
      expect(userRoles.includes(Roles.COMPANY)).toBeFalsy();
    });

    it('deletes company from the database', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      await sendCreateCompanyRequest(accessToken, COMPANY_ONE);

      const company = await getCompanyByNameFromDB(COMPANY_ONE.name);

      await sendDeleteCompanyRequest(accessToken, company.id);

      const deleteCompany = await getCompanyByNameFromDB(COMPANY_ONE.name);

      expect(deleteCompany).toBe(null);
    });

    it('deletes company branches from the database', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        [],
      );
      const branchesBefore = await getCompanyBranchesFromDB(companyId);

      await sendDeleteCompanyRequest(accessToken, companyId);

      const branchesAfter = await getCompanyBranchesFromDB(companyId);

      expect(branchesBefore).not.toEqual([]);
      expect(branchesAfter).toEqual([]);
    });

    it('deletes company offers from the database', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const offersBefore = await getCompanyOffersFromDB(companyId);

      await sendDeleteCompanyRequest(accessToken, companyId);

      const offersAfter = await getCompanyOffersFromDB(companyId);

      expect(offersBefore).not.toEqual([]);
      expect(offersAfter).toEqual([]);
    });

    it('deletes applications associated with company offers', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const { user } = await createUserWithApplications(USER_TWO, offers);

      const applicationsBefore = await getUserApplicationsFromDB(user.id);

      await sendDeleteCompanyRequest(accessToken, companyId);

      const applicationsAfter = await getUserApplicationsFromDB(user.id);

      expect(applicationsBefore).not.toEqual([]);
      expect(applicationsAfter).toEqual([]);
    });

    it('calls s3 service to delete applications files associated with company offers', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      await createUserWithApplications(USER_TWO, offers);

      const deleteImageFile = jest.spyOn(s3Service, 'deleteApplicationFile');

      await sendDeleteCompanyRequest(accessToken, companyId);

      expect(deleteImageFile).toHaveBeenCalledTimes(2);
    });

    it('calls s3 service to delete image files', async () => {
      const { accessToken, companyId } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );
      const deleteImageFile = jest.spyOn(s3Service, 'deleteImageFile');

      await sendDeleteCompanyRequest(accessToken, companyId);

      expect(deleteImageFile).toHaveBeenCalledTimes(2);
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
      const { accessToken } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendDeleteCompanyRequest(
        accessToken,
        INVALID_COMPANY_ID,
      );
      expect(response.status).toBe(404);
    });
  });
});
