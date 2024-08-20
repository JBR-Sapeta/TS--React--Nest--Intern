import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException, INestApplication } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import path = require('path');
import { isNil } from 'ramda';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { OfferEntity } from '../src/entity';
import {
  BranchRepository,
  CompanyRepository,
  UserRepository,
  OfferRepository,
  ApplicationRepository,
} from './../src/repository';

import { AppModule } from '../src/app/app.module';
import { CacheService } from './../src/cache/cache.service';
import { MailService } from './../src/mail/mail.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { AdminService } from './../src/admin/admin.service';
import { AuthService } from './../src/auth/auth.service';
import { CompanyService } from './../src/company/company.service';
import { BranchService } from './../src/branch/branch.service';
import { OfferService } from './../src/offer/offer.service';
import { S3Service } from './../src/s3/s3.service';

import { mailService } from './mocks/mail-service';
import { geocoderService } from './mocks/geocoder-service';
import { s3Service } from './mocks/s3-service';

import {
  INVALID_ACCESS_TOKEN,
  USER_ONE,
  USER_THREE,
  USER_TWO,
} from './helpers/auth-data';
import { COMPANY_ONE, COMPANY_TWO } from './helpers/company-data';
import {
  COMPANY_ONE_BRANCHES,
  COMPANY_TWO_BRANCHES,
} from './helpers/branch-data';
import {
  COMPANY_ONE_OFFERS,
  COMPANY_TWO_OFFERS,
  INVALID_OFFER_ID,
} from './helpers/offer-data';
import {
  APPLICATION_ONE,
  FILES,
  FILE_KEY,
  INVALID_APPLICATION_ID,
} from './helpers/application-data';

describe('ApplicationController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let cacheService: CacheService;
  let userRepository: UserRepository;
  let companyRepository: CompanyRepository;
  let branchRepository: BranchRepository;
  let offerRepository: OfferRepository;
  let applicationRepository: ApplicationRepository;
  let authService: AuthService;
  let companyService: CompanyService;
  let branchService: BranchService;
  let offerService: OfferService;
  let adminService: AdminService;

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
    adminService = moduleFixture.get<AdminService>(AdminService);
    authService = moduleFixture.get<AuthService>(AuthService);
    companyService = moduleFixture.get<CompanyService>(CompanyService);
    branchService = moduleFixture.get<BranchService>(BranchService);
    offerService = moduleFixture.get<OfferService>(OfferService);

    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    companyRepository = moduleFixture.get<CompanyRepository>(CompanyRepository);
    branchRepository = moduleFixture.get<BranchRepository>(BranchRepository);
    offerRepository = moduleFixture.get<OfferRepository>(OfferRepository);
    applicationRepository = moduleFixture.get<ApplicationRepository>(
      ApplicationRepository,
    );

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

    const tokens = await authService.login({
      email: userData.email,
      password: userData.password,
    });

    return {
      accessToken: tokens.data.accessToken,
      user: updatedUser,
      offers,
    };
  };

  const createUserWithApplication = async (
    userData: any,
    offer: OfferEntity,
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

    const application = await applicationRepository.create({
      message: null,
      fileKey: FILE_KEY,
      user: updatedUser,
      offer,
    });

    const createdApplication = await applicationRepository.save(application);

    return {
      user: updatedUser,
      accessToken,
      applicationId: createdApplication.id,
    };
  };

  const getUserApplicationFromDB = async (offerId: number, userId: string) => {
    const offer = await applicationRepository.findOne({
      where: { offerId, userId },
    });
    return offer;
  };

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendCreateApplicationRequest = async (
    token: string,
    offerId: number | string,
    fileName: null | string,
    data: any,
  ) => {
    try {
      if (isNil(fileName) || isEmpty(fileName)) {
        const response = await request(app.getHttpServer())
          .post(`/applications/${offerId}/create`)
          .set('Authorization', `Bearer ${token}`)
          .field('message', data.message);

        return response;
      } else {
        const response = await request(app.getHttpServer())
          .post(`/applications/${offerId}/create`)
          .set('Authorization', `Bearer ${token}`)
          .attach('file', path.join('.', 'test', 'resources', fileName))
          .field('message', data.message);

        return response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendGetApplicationFileRequest = async (
    token: string,
    applicationId: number | string,
  ) => {
    const response = await request(app.getHttpServer())
      .get(`/applications/${applicationId}/file`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendGetOfferApplicationsRequest = async (
    token: string,
    offerId: number | string,
    params: any,
  ) => {
    const queryParams = Object.entries(params).map(
      ([key, value]) => `&${key}=${value}`,
    );

    const response = await request(app.getHttpServer())
      .get(`/applications/offers/${offerId}?${queryParams.join('')}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendGetUserApplicationsRequest = async (
    token: string,
    userId: number | string,
    params: any,
  ) => {
    const queryParams = Object.entries(params).map(
      ([key, value]) => `&${key}=${value}`,
    );

    const response = await request(app.getHttpServer())
      .get(`/applications/users/${userId}?${queryParams.join('')}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  const sendDeleteApplicationRequest = async (
    token: string,
    applicationId: number | string,
  ) => {
    const response = await request(app.getHttpServer())
      .delete(`/applications/${applicationId}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    return response;
  };

  // ------------------------------- CREATE - Valid Request ------------------------------ \\

  describe('/applications/:offerId/create (POST) - Valid Request', () => {
    it('returns 201 status code', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(201);
    });

    it('returns success message', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('creates application in database', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createActiveUser(USER_TWO);

      await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      const application = await getUserApplicationFromDB(offers[0].id, user.id);

      expect(application).toBeTruthy();
    });

    it('sets message field to null when mesage is an empty string', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createActiveUser(USER_TWO);

      const APPLICATION = { message: '' };

      await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION,
      );

      const application = await getUserApplicationFromDB(offers[0].id, user.id);

      expect(application.message).toBe(null);
    });

    it('calls s3 service to upload application file', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const uploadApplicationFile = jest.spyOn(
        s3Service,
        'uploadApplicationFile',
      );

      await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(uploadApplicationFile).toHaveBeenCalled();
    });
  });

  // ------------------------------ CREATE - Invalid Request ----------------------------- \\

  describe('/applications/:offerId/create  (POST) - Invalid Request', () => {
    it('returns 400 status code when application file is not provided', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        null,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when provided file is biger than 2MB', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.INVALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when provided file has TXT format', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_TXT,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when provided file has DOCX format', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_DOCX,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when url param is ivalid', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        'INVALID_OFFER_ID',
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when message is longer than 512 characters', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const message = 'Lorem Ipsum'.repeat(50);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.INVALID_PDF,
        { message },
      );

      expect(response.status).toBe(400);
    });

    // @TODO - fix Jest error

    // fit('returns 401 status code when access token is invalid', async () => {
    //   const { offers } = await createUserAndCompanyWithOffers(
    //     USER_ONE,
    //     COMPANY_ONE,
    //     COMPANY_ONE_BRANCHES,
    //     COMPANY_ONE_OFFERS,
    //   );
    //   await createActiveUser(USER_TWO);

    //   const response = await sendCreateApplicationRequest(
    //     INVALID_ACCESS_TOKEN,
    //     offers[0].id,
    //     FILES.VALID_PDF,
    //     APPLICATION_ONE,
    //   );

    //   expect(response.status).toBe(401);
    // });

    it('returns 403 status code when company owner sends application to own offer', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when a company owner sends application to offer', async () => {
      const { accessToken } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { offers } = await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when user already has application', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when offer with given id does not exist', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        INVALID_OFFER_ID,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 status code when offer is not active', async () => {
      const offer = { ...COMPANY_ONE_OFFERS[0] };
      offer.isActive = false;
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        [offer],
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 status code when offer expired', async () => {
      const offer = { ...COMPANY_ONE_OFFERS[0] };
      offer.expirationTime = -1;
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        [offer],
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(404);
    });

    it('returns 502 status code when file upload fail', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createActiveUser(USER_TWO);

      jest
        .spyOn(s3Service, 'uploadApplicationFile')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });

      const response = await sendCreateApplicationRequest(
        accessToken,
        offers[0].id,
        FILES.VALID_PDF,
        APPLICATION_ONE,
      );

      expect(response.status).toBe(502);
    });
  });

  // ------------------------------ GET FILE - Valid Request ----------------------------- \\

  describe('/applications/:applicationId/file (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetApplicationFileRequest(
        accessToken,
        applicationId,
      );

      expect(response.status).toBe(200);
    });

    it('returns pdf file', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetApplicationFileRequest(
        accessToken,
        applicationId,
      );

      expect(response.header['content-type']).toContain(`application/pdf`);
      expect(response.header['content-disposition']).toBeDefined();
    });

    it('calls s3 service to get application file', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const uploadApplicationFile = jest.spyOn(s3Service, 'getApplicationFile');

      await sendGetApplicationFileRequest(accessToken, applicationId);

      expect(uploadApplicationFile).toHaveBeenCalled();
    });
  });

  // ----------------------------- GET FILE - Invalid Request ---------------------------- \\

  describe('/applications/:applicationId/file  (GET) - Invalid Request', () => {
    it('returns 400 status code when invalid param is provided', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);

      const response = await sendGetApplicationFileRequest(
        accessToken,
        'applicationId',
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetApplicationFileRequest(
        INVALID_ACCESS_TOKEN,
        applicationId,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user is not a company owner', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken, applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetApplicationFileRequest(
        accessToken,
        applicationId,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when application with provided id does not exist', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);

      const response = await sendGetApplicationFileRequest(
        accessToken,
        INVALID_APPLICATION_ID,
      );

      expect(response.status).toBe(404);
    });

    it('returns 502 status code when downloading file failed', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      jest
        .spyOn(s3Service, 'getApplicationFile')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });

      const response = await sendGetApplicationFileRequest(
        accessToken,
        applicationId,
      );

      expect(response.status).toBe(502);
    });
  });

  // ----------------------- GET OFFER APPLICATIONS - Valid Request ---------------------- \\

  describe('/applications/offers/:offerId (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        {},
      );

      expect(response.status).toBe(200);
    });

    it('returns proper pagination object', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        {},
      );

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

    it('returns array of applications', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        {},
      );

      const data = response.body.data;

      expect(Object.keys(data[0])).toEqual([
        'id',
        'message',
        'isDownloaded',
        'createdAt',
        'user',
      ]);
    });

    it('returns array of applications which contains base user data', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        {},
      );

      const data = response.body.data;

      expect(Object.keys(data[0].user)).toEqual([
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
      ]);
    });

    it('returns one element when limit is set to 1', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        { limit: 1 },
      );

      expect(response.body.limit).toBe(1);
    });

    it('returns second page when pageNumber is set to 1', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        { limit: 1, pageNumber: 1 },
      );

      expect(response.body.pageNumber).toBe(1);
    });
  });

  // ---------------------- GET OFFER APPLICATIONS - Invalid Request --------------------- \\

  describe('/applications/offers/:offerId  (GET) - Invalid Request', () => {
    it('returns 400 status code when invalid offerid param is provided', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        'offerId',
        {},
      );

      expect(response.status).toBe(400);
    });

    it.each`
      invalidParam    | value
      ${'limit'}      | ${300}
      ${'pageNumber'} | ${-300}
    `(
      'returns 400 status code when provided $invalidParam param is invalid ',
      async ({ invalidParam, value }) => {
        const { accessToken, offers } = await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );
        await createUserWithApplication(USER_TWO, offers[0]);
        await createUserWithApplication(USER_THREE, offers[0]);

        const params = {};
        params[invalidParam] = value;

        const response = await sendGetOfferApplicationsRequest(
          accessToken,
          offers[0].id,
          params,
        );

        expect(response.status).toBe(400);
      },
    );

    it('returns 401 status code when invalid access token is provided', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        INVALID_ACCESS_TOKEN,
        offers[0].id,
        {},
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when offer belongs to other company', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        [],
        [],
      );
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        offers[0].id,
        {},
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when offer deos not exist', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetOfferApplicationsRequest(
        accessToken,
        INVALID_OFFER_ID,
        {},
      );

      expect(response.status).toBe(404);
    });
  });

  // ------------------------ GET USER APPLICATIONS - Valid Request ---------------------- \\

  describe('/applications/users/:userId (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        {},
      );

      expect(response.status).toBe(200);
    });

    it('returns proper pagination object', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        {},
      );

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

    it('returns array applications', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        {},
      );

      const data = response.body.data;

      expect(Object.keys(data[0])).toEqual([
        'id',
        'message',
        'isDownloaded',
        'createdAt',
        'offer',
      ]);
    });

    it('returns array of applications which contains base offer data', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        {},
      );

      const data = response.body.data;

      expect(Object.keys(data[0].offer)).toEqual([
        'id',
        'slug',
        'title',
        'position',
        'companyId',
        'companyName',
        'logoUrl',
        'isActive',
      ]);
    });

    it('returns one element when limit is set to 1', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        { limit: 1 },
      );

      expect(response.body.limit).toBe(1);
    });

    it('returns second page when pageNumber is set to 1', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        { limit: 1, pageNumber: 1 },
      );

      expect(response.body.pageNumber).toBe(1);
    });
  });

  // ----------------------- GET USER APPLICATIONS - Invalid Request --------------------- \\

  describe('/applications/users/:userId  (GET) - Invalid Request', () => {
    it('returns 400 status code when invalid offerid param is provided', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        36321,
        {},
      );

      expect(response.status).toBe(400);
    });

    it.each`
      invalidParam    | value
      ${'limit'}      | ${300}
      ${'pageNumber'} | ${-300}
    `(
      'returns 400 status code when provided $invalidParam param is invalid ',
      async ({ invalidParam, value }) => {
        const { offers } = await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );
        const { accessToken, user } = await createUserWithApplication(
          USER_TWO,
          offers[0],
        );

        const params = {};
        params[invalidParam] = value;

        const response = await sendGetUserApplicationsRequest(
          accessToken,
          user.id,
          params,
        );

        expect(response.status).toBe(400);
      },
    );

    it('returns 401 status code when invalid access token is provided', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user } = await createUserWithApplication(USER_TWO, offers[0]);
      await createUserWithApplication(USER_THREE, offers[0]);

      const response = await sendGetUserApplicationsRequest(
        INVALID_ACCESS_TOKEN,
        user.id,
        {},
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when offer belongs to other user', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { user } = await createUserWithApplication(USER_TWO, offers[0]);

      const { accessToken } = await createUserWithApplication(
        USER_THREE,
        offers[0],
      );

      const response = await sendGetUserApplicationsRequest(
        accessToken,
        user.id,
        {},
      );

      expect(response.status).toBe(403);
    });
  });

  // ------------------------------- DELETE - Valid Request ------------------------------ \\

  describe('/applications/:applicationId/delete (DELETE) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        accessToken,
        applicationId,
      );

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        accessToken,
        applicationId,
      );

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        accessToken,
        applicationId,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('removes application from database', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId, accessToken, user } =
        await createUserWithApplication(USER_TWO, offers[0]);

      await sendDeleteApplicationRequest(accessToken, applicationId);

      const application = await getUserApplicationFromDB(offers[0].id, user.id);

      expect(application).toBe(null);
    });

    it('calls s3 service to delete application file', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const deleteApplicationFile = jest.spyOn(
        s3Service,
        'deleteApplicationFile',
      );

      await sendDeleteApplicationRequest(accessToken, applicationId);

      expect(deleteApplicationFile).toHaveBeenCalled();
    });
  });

  // ------------------------------ DELETE - Invalid Request ----------------------------- \\

  describe('/applications/:applicationId/delete  (DELETE) - Invalid Request', () => {
    it('returns 400 status code when url param is ivalid', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        accessToken,
        'applicationId',
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        INVALID_ACCESS_TOKEN,
        applicationId,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when application belongs to other user', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );
      const { accessToken } = await createUserWithApplication(
        USER_THREE,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        accessToken,
        applicationId,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when application with provided id does not exist', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      const response = await sendDeleteApplicationRequest(
        accessToken,
        INVALID_APPLICATION_ID,
      );

      expect(response.status).toBe(404);
    });

    it('returns 502 status code when deleting file failed', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      const { applicationId, accessToken } = await createUserWithApplication(
        USER_TWO,
        offers[0],
      );

      jest
        .spyOn(s3Service, 'deleteApplicationFile')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });

      const response = await sendDeleteApplicationRequest(
        accessToken,
        applicationId,
      );

      expect(response.status).toBe(502);
    });
  });
});
