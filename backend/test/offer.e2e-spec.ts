import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { isEmpty } from 'ramda';
import { DataSource } from 'typeorm';

import {
  BranchRepository,
  CompanyRepository,
  UserRepository,
  OfferRepository,
} from './../src/repositories';

import { AppModule } from './../src/app.module';
import { CacheService } from './../src/cache/cache.service';
import { MailService } from './../src/mail/mail.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { AuthService } from './../src/auth/auth.service';
import { CompanyService } from './../src/company/company.service';
import { BranchService } from './../src/branch/branch.service';
import { OfferService } from './../src/offer/offer.service';
import { S3Service } from './../src/s3/s3.service';

import { mailService } from './mocks/mail-service';
import { geocoderService } from './mocks/geocoder-service';
import { s3Service } from './mocks/s3-service';

import {
  COMPANY_ONE,
  COMPANY_TWO,
  INVALID_COMPANY_ID,
} from './helpers/company-data';
import { INVALID_ACCESS_TOKEN, USER_ONE, USER_TWO } from './helpers/auth-data';
import {
  BRANCH_ONE,
  COMPANY_ONE_BRANCHES,
  COMPANY_TWO_BRANCHES,
} from './helpers/branch-data';
import {
  COMPANY_ONE_OFFERS,
  COMPANY_TWO_OFFERS,
  INVALID_OFFER,
  INVALID_OFFER_ID,
  OFFER_ONE,
  OFFER_THREE,
} from './helpers/offer-data';

describe('OfferController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let cacheService: CacheService;
  let userRepository: UserRepository;
  let companyRepository: CompanyRepository;
  let branchRepository: BranchRepository;
  let offerRepository: OfferRepository;
  let authService: AuthService;
  let companyService: CompanyService;
  let branchService: BranchService;
  let offerService: OfferService;

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
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    companyRepository = moduleFixture.get<CompanyRepository>(CompanyRepository);
    branchRepository = moduleFixture.get<BranchRepository>(BranchRepository);
    offerRepository = moduleFixture.get<OfferRepository>(OfferRepository);
    authService = moduleFixture.get<AuthService>(AuthService);
    companyService = moduleFixture.get<CompanyService>(CompanyService);
    branchService = moduleFixture.get<BranchService>(BranchService);
    offerService = moduleFixture.get<OfferService>(OfferService);

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

  const createUserAndCompanyWithBranches = async (
    userData: any,
    companyData: any,
    isVerified: boolean,
    companyBranches: any = [],
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

    if (isVerified) {
      company.isVerified = true;
      await companyRepository.save(company);
    }

    let branches = [];

    if (!isEmpty(companyBranches)) {
      for (const branch of companyBranches) {
        await branchService.createBranch(company.id, updatedUser, branch);
      }

      const createdBranches = await branchRepository.find({
        where: { companyId: company.id },
      });
      branches = createdBranches;
    }

    return {
      user: updatedUser,
      accessToken: tokens.data.accessToken,
      companyId: company.id,
      branches,
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
      companyId: company.id,
      offers,
    };
  };

  const getOffersByCompanyIdFromDB = async (companyId: string) => {
    const [offers, count] = await offerRepository.findAndCount({
      where: { companyId },
    });
    return { offers, count };
  };

  const getOfferByIdFromDB = async (offerId: number) => {
    const offer = await offerRepository.findOne({
      where: { id: offerId },
    });
    return offer;
  };

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendCreateOfferRequest = async (
    token: string,
    companyId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .post(`/offers/${companyId}/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendGetOffersRequest = async (params: any) => {
    const queryParams = Object.entries(params).map(
      ([key, value]) => `&${key}=${value}`,
    );

    const response = await request(app.getHttpServer())
      .get(`/offers?${queryParams.join('')}`)
      .send();
    return response;
  };

  const sendGetPartialOfferRequest = async (
    companyId: string,
    offerId: any,
  ) => {
    const response = await request(app.getHttpServer())
      .get(`/offers/${companyId}/${offerId}/partial`)
      .send();
    return response;
  };

  const sendGetFullOfferRequest = async (
    token: string,
    companyId: string,
    offerId: any,
  ) => {
    const response = await request(app.getHttpServer())
      .get(`/offers/${companyId}/${offerId}/full`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  const sendUpdateOfferRequest = async (
    token: string,
    companyId: string,
    offerId: any,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .put(`/offers/${companyId}/${offerId}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendDeleteOfferRequest = async (
    token: string,
    companyId: string,
    offerId: any,
  ) => {
    const response = await request(app.getHttpServer())
      .delete(`/offers/${companyId}/${offerId}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  // ------------------------------- CREATE - Valid Request ------------------------------ \\

  describe('/offers/:companyId/create (POST) - Valid Request', () => {
    it('returns 201 status code', async () => {
      const { accessToken, companyId, branches } =
        await createUserAndCompanyWithBranches(
          USER_ONE,
          COMPANY_ONE,
          true,
          COMPANY_ONE_BRANCHES,
        );

      const offerBody = { ...OFFER_ONE, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(response.status).toBe(201);
    });

    it('returns success message', async () => {
      const { accessToken, companyId, branches } =
        await createUserAndCompanyWithBranches(
          USER_ONE,
          COMPANY_ONE,
          true,
          COMPANY_ONE_BRANCHES,
        );

      const offerBody = { ...OFFER_ONE, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId, branches } =
        await createUserAndCompanyWithBranches(
          USER_ONE,
          COMPANY_ONE,
          true,
          COMPANY_ONE_BRANCHES,
        );

      const offerBody = { ...OFFER_ONE, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('creates offer in database', async () => {
      const { accessToken, companyId, branches } =
        await createUserAndCompanyWithBranches(
          USER_ONE,
          COMPANY_ONE,
          true,
          COMPANY_ONE_BRANCHES,
        );

      const offerBody = { ...OFFER_ONE, branches: [branches[0].id] };

      await sendCreateOfferRequest(accessToken, companyId, offerBody);

      const { offers, count } = await getOffersByCompanyIdFromDB(companyId);

      expect(offers[0]).toBeTruthy();
      expect(count).toBe(1);
    });
  });

  // ------------------------------ CREATE - Invalid Request ----------------------------- \\

  describe('/offers/:companyId/create (POST) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { accessToken, companyId, branches } =
        await createUserAndCompanyWithBranches(
          USER_ONE,
          COMPANY_ONE,
          true,
          COMPANY_ONE_BRANCHES,
        );

      const offerBody = { ...INVALID_OFFER, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when url param is ivalid', async () => {
      const { accessToken, branches } = await createUserAndCompanyWithBranches(
        USER_ONE,
        COMPANY_ONE,
        true,
        COMPANY_ONE_BRANCHES,
      );

      const offerBody = { ...INVALID_OFFER, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        accessToken,
        'companyId',
        offerBody,
      );

      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'title'}
      ${'position'}
      ${'description'}
      ${'isPaid'}
      ${'isActive'}
      ${'expirationTime'}
      ${'employmentType'}
      ${'operatingMode'}
      ${'branches'}
      ${'categories'}
    `(
      'returns proper error message when $invalidField field is invalid',
      async ({ invalidField }) => {
        const { accessToken, companyId } =
          await createUserAndCompanyWithBranches(
            USER_ONE,
            COMPANY_ONE,
            true,
            COMPANY_ONE_BRANCHES,
          );

        const offerBody = {
          ...OFFER_ONE,
        };

        offerBody[invalidField] = INVALID_OFFER[invalidField];

        const response = await sendCreateOfferRequest(
          accessToken,
          companyId,
          offerBody,
        );

        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      const { companyId, branches } = await createUserAndCompanyWithBranches(
        USER_ONE,
        COMPANY_ONE,
        true,
        COMPANY_ONE_BRANCHES,
      );

      const offerBody = { ...INVALID_OFFER, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        offerBody,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company is not verified', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithBranches(
        USER_ONE,
        COMPANY_ONE,
        false,
      );

      const offerBody = { ...OFFER_ONE };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when company belongs to another user', async () => {
      const { companyId, branches } = await createUserAndCompanyWithBranches(
        USER_TWO,
        COMPANY_TWO,
        true,
        COMPANY_TWO_BRANCHES,
      );

      const { accessToken } = await createUserAndCompanyWithBranches(
        USER_ONE,
        COMPANY_ONE,
        true,
        COMPANY_ONE_BRANCHES,
      );

      const offerBody = { ...OFFER_ONE, branches: [branches[0].id] };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company with provided id does not exist', async () => {
      const { accessToken, branches } = await createUserAndCompanyWithBranches(
        USER_TWO,
        COMPANY_TWO,
        true,
        COMPANY_TWO_BRANCHES,
      );

      const offerBody = {
        ...OFFER_ONE,
        branches: [branches[0].id, branches[1].id],
      };

      const response = await sendCreateOfferRequest(
        accessToken,
        INVALID_COMPANY_ID,
        offerBody,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 status code when all provided branches do not belong company', async () => {
      const { branches } = await createUserAndCompanyWithBranches(
        USER_TWO,
        COMPANY_TWO,
        true,
        COMPANY_TWO_BRANCHES,
      );

      const { accessToken, companyId } = await createUserAndCompanyWithBranches(
        USER_ONE,
        COMPANY_ONE,
        true,
        COMPANY_ONE_BRANCHES,
      );

      const offerBody = {
        ...OFFER_ONE,
        branches: [branches[0].id, branches[1].id],
      };

      const response = await sendCreateOfferRequest(
        accessToken,
        companyId,
        offerBody,
      );

      expect(response.status).toBe(404);
    });

    it.each`
      invalidField
      ${'branches'}
      ${'categories'}
    `(
      'returns 404 status code when $invalidField entities deos not exist in DB',
      async ({ invalidField }) => {
        const { accessToken, companyId, branches } =
          await createUserAndCompanyWithBranches(
            USER_ONE,
            COMPANY_ONE,
            true,
            COMPANY_ONE_BRANCHES,
          );

        const offerBody = {
          ...OFFER_ONE,
          branches: [branches[0].id],
        };

        offerBody[invalidField] = [1000];

        const response = await sendCreateOfferRequest(
          accessToken,
          companyId,
          offerBody,
        );

        expect(response.status).toBe(404);
      },
    );
  });

  // ----------------------------- GET OFFERS - Valid Request ---------------------------- \\
  describe('/offers (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetOffersRequest({ limit: 10, pageNumber: 0 });

      expect(response.status).toBe(200);
    });

    it('returns proper pagination object', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetOffersRequest({ limit: 10, pageNumber: 0 });

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

    it('returns array of offers as data', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetOffersRequest({ limit: 10, pageNumber: 0 });

      expect(response.body.data.length).toBe(2);
      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'title',
        'position',
        'isPaid',
        'isActive',
        'createdAt',
        'employmentTypeId',
        'operatingModeId',
        'locations',
        'categories',
        'company',
      ]);
    });

    it('returns one element when limit is set to 1', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetOffersRequest({ limit: 1 });

      expect(response.body.data.length).toBe(1);
    });

    it('returns second page when pageNumber is set to 1', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetOffersRequest({ limit: 1, pageNumber: 1 });

      expect(response.body.pageNumber).toBe(1);
    });

    it('returns filtered offers when categories param is set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );
      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendGetOffersRequest({ categories: '1' });

      expect(response.body.data.length).toBe(2);
    });

    it('returns filtered offers when city param is set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const encodedParam = encodeURIComponent('Kraków');

      const response = await sendGetOffersRequest({ city: encodedParam });

      expect(response.body.data.length).toBe(3);
    });

    it('returns filtered offers when region param is set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendGetOffersRequest({ region: 'pomorskie' });

      expect(response.body.data.length).toBe(1);
    });

    it('returns filtered offers when location params are set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      // Point in Cracow
      const { lat, long } = BRANCH_ONE.address;

      const response = await sendGetOffersRequest({ lat, long, range: 4 });

      expect(response.body.data.length).toBe(3);
    });

    it('returns filtered offers when employmentType param is set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendGetOffersRequest({ employmentType: 1 });

      expect(response.body.data.length).toBe(1);
    });

    it('returns filtered offers when operatingMode param is set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendGetOffersRequest({ operatingMode: 3 });

      expect(response.body.data.length).toBe(0);
    });

    it('returns filtered offers when isPaid param is set', async () => {
      await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendGetOffersRequest({ isPaid: true });

      expect(response.body.data.length).toBe(2);
    });
  });

  // ---------------------------- GET OFFERS - Invalid Request --------------------------- \\
  describe('/offers (GET) - Invalid Request', () => {
    it.each`
      invalidParam        | value
      ${'limit'}          | ${300}
      ${'pageNumber'}     | ${-300}
      ${'lat'}            | ${300}
      ${'long'}           | ${300}
      ${'range'}          | ${300}
      ${'employmentType'} | ${300}
      ${'operatingMode'}  | ${300}
    `(
      'returns 400 status code when provided $invalidParam param is invalid ',
      async ({ invalidParam, value }) => {
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

        const params = {};
        params[invalidParam] = value;

        const response = await sendGetOffersRequest(params);

        expect(response.status).toBe(400);
      },
    );
  });

  // -------------------------- GET PARTIAL OFFER - Valid Request ------------------------ \\
  describe('/offers/:companyId/:offerId/partial (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { offers, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetPartialOfferRequest(
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(200);
    });

    it('returns proper success response object with payload', async () => {
      const { offers, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetPartialOfferRequest(
        companyId,
        offers[0].id,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns array of offers as data', async () => {
      const { offers, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetPartialOfferRequest(
        companyId,
        offers[0].id,
      );

      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'title',
        'position',
        'description',
        'isPaid',
        'isActive',
        'createdAt',
        'employmentTypeId',
        'operatingModeId',
        'branches',
        'categories',
        'company',
      ]);
    });
  });

  // ------------------------- GET PARTIAL OFFER - Invalid Request ----------------------- \\
  describe('/offers/:companyId/:offerId/partial (GET) - Invalid Request', () => {
    it('returns 400 status code when invalid param is provided', async () => {
      const { companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetPartialOfferRequest(companyId, 'offerId');

      expect(response.status).toBe(400);
    });

    it('returns 404 when offer with given id does not exist', async () => {
      const { companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetPartialOfferRequest(
        companyId,
        INVALID_OFFER_ID,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 when company with given id does not exist', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetPartialOfferRequest(
        INVALID_COMPANY_ID,
        offers[0].id,
      );

      expect(response.status).toBe(404);
    });
  });

  // -------------------------- GET FULL OFFER - Valid Request -------------------------- \\
  describe('/offers/:companyId/:offerId/full (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, offers, companyId } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendGetFullOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(200);
    });

    it('returns proper success response object with payload', async () => {
      const { accessToken, offers, companyId } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendGetFullOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns offer data', async () => {
      const { accessToken, offers, companyId } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendGetFullOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'title',
        'position',
        'description',
        'isPaid',
        'isActive',
        'expirationDate',
        'removalDate',
        'createdAt',
        'updatedAt',
        'employmentTypeId',
        'operatingModeId',
        'branches',
        'categories',
        'companyId',
      ]);
    });
  });

  // -------------------------- GET FULL OFFER - Invalid Request ------------------------- \\
  describe('/offers/:companyId/:offerId/full (GET) - Invalid Request', () => {
    it('returns 400 status code when invalid param is provided', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetFullOfferRequest(
        accessToken,
        companyId,
        'offerId',
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when when access token is invalid', async () => {
      const { companyId, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetFullOfferRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company does not belongs to user', async () => {
      const { companyId, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { accessToken } = await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendGetFullOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 when offer with given id does not exist', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetFullOfferRequest(
        accessToken,
        companyId,
        INVALID_OFFER_ID,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 when company with given id does not exist', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendGetFullOfferRequest(
        accessToken,
        INVALID_COMPANY_ID,
        offers[0].id,
      );

      expect(response.status).toBe(404);
    });
  });

  // ------------------------------- UPDATE - Valid Request ------------------------------ \\
  describe('/offers/:companyId/:offerId/update (PUT) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const offerBody = { isPaid: false };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const offerBody = { isPaid: false };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const offerBody = { isPaid: false };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('updates offer in database', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const offerBody = { isPaid: false };

      await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );
      const updatedOffer = await getOfferByIdFromDB(offers[0].id);

      expect(offers[0].isPaid).not.toEqual(updatedOffer.isPaid);
    });
  });

  // ------------------------------ UPDATE - Invalid Request ----------------------------- \\
  describe('/offers/:companyId/:offerId/update (PUT) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const offerBody = { title: INVALID_OFFER.title };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when request body is empty', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        {},
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when url param is ivalid', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const offerBody = { isPaid: false };

      const response = await sendUpdateOfferRequest(
        accessToken,
        'companyId',
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'title'}
      ${'position'}
      ${'description'}
      ${'isPaid'}
      ${'isActive'}
      ${'employmentType'}
      ${'operatingMode'}
      ${'branches'}
      ${'categories'}
    `(
      'returns proper error message when $invalidField field is invalid',
      async ({ invalidField }) => {
        const { accessToken, companyId, offers } =
          await createUserAndCompanyWithOffers(
            USER_ONE,
            COMPANY_ONE,
            COMPANY_ONE_BRANCHES,
            COMPANY_ONE_OFFERS,
          );

        const offerBody = {};

        offerBody[invalidField] = INVALID_OFFER[invalidField];

        const response = await sendUpdateOfferRequest(
          accessToken,
          companyId,
          offers[0].id,
          offerBody,
        );

        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      const { companyId, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const offerBody = { title: OFFER_THREE.title };

      const response = await sendUpdateOfferRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company belongs to another user', async () => {
      const { companyId, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { accessToken } = await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const offerBody = { title: OFFER_THREE.title };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when offer belongs to another company', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { companyId, accessToken } = await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const offerBody = { title: OFFER_THREE.title };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company does not exist', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const offerBody = { title: OFFER_THREE.title };

      const response = await sendUpdateOfferRequest(
        accessToken,
        INVALID_COMPANY_ID,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 status code when offer does not exist', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const offerBody = { title: OFFER_THREE.title };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        INVALID_OFFER_ID,
        offerBody,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 status code when all provided branches do not bleong to company', async () => {
      const { branches } = await createUserAndCompanyWithBranches(
        USER_TWO,
        COMPANY_TWO,
        true,
        COMPANY_TWO_BRANCHES,
      );

      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const offerBody = {
        branches: [branches[0].id, branches[1].id],
      };

      const response = await sendUpdateOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
        offerBody,
      );

      expect(response.status).toBe(404);
    });

    it.each`
      invalidField
      ${'branches'}
      ${'categories'}
    `(
      'returns 404 status code when $invalidField entities deos not exist in DB',
      async ({ invalidField }) => {
        const { accessToken, companyId, offers } =
          await createUserAndCompanyWithOffers(
            USER_ONE,
            COMPANY_ONE,
            COMPANY_ONE_BRANCHES,
            COMPANY_ONE_OFFERS,
          );

        const offerBody = {};

        offerBody[invalidField] = [1000];

        const response = await sendUpdateOfferRequest(
          accessToken,
          companyId,
          offers[0].id,
          offerBody,
        );

        expect(response.status).toBe(404);
      },
    );
  });

  // ------------------------------- DELETE - Valid Request ------------------------------ \\
  describe('/offers/:companyId/:offerId/delete (DELETE) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendDeleteOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendDeleteOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendDeleteOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('removes offer from DB ', async () => {
      const { accessToken, companyId, offers } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      await sendDeleteOfferRequest(accessToken, companyId, offers[0].id);

      const offer = await getOfferByIdFromDB(offers[0].id);

      expect(offer).not.toBeTruthy();
    });
  });

  // ------------------------------ DELETE - Invalid Request ----------------------------- \\
  describe('/offers/:companyId/:offerId/delete (DELETE) - Invalid Request', () => {
    it('returns 400 status code when invalid offer param is provided', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendDeleteOfferRequest(
        accessToken,
        companyId,
        'offers[0].id',
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 status code when invalid company param is provided', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendDeleteOfferRequest(
        accessToken,
        'companyId',
        offers[0].id,
      );

      expect(response.status).toBe(400);
    });

    it('returns 401 status code when access token is invalid', async () => {
      const { companyId, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendDeleteOfferRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(401);
    });

    it('returns 403 status code when offer belongs to another company', async () => {
      const { companyId, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { accessToken } = await createUserAndCompanyWithOffers(
        USER_TWO,
        COMPANY_TWO,
        COMPANY_TWO_BRANCHES,
        COMPANY_TWO_OFFERS,
      );

      const response = await sendDeleteOfferRequest(
        accessToken,
        companyId,
        offers[0].id,
      );

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when offer companyId does not match provided id ', async () => {
      const { accessToken, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendDeleteOfferRequest(
        accessToken,
        INVALID_COMPANY_ID,
        offers[0].id,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when offer with provided id does not exist', async () => {
      const { accessToken, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const response = await sendDeleteOfferRequest(
        accessToken,
        companyId,
        INVALID_OFFER_ID,
      );

      expect(response.status).toBe(404);
    });
  });
});
