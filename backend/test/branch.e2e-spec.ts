import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import {
  AddressRepository,
  BranchRepository,
  CompanyRepository,
  OfferRepository,
  UserRepository,
} from './../src/repository';

import { AppModule } from '../src/app/app.module';
import { AdminService } from './../src/admin/admin.service';
import { AuthService } from './../src/auth/auth.service';
import { BranchService } from './../src/branch/branch.service';
import { CacheService } from './../src/cache/cache.service';
import { CompanyService } from './../src/company/company.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { MailService } from './../src/mail/mail.service';
import { OfferService } from './../src/offer/offer.service';
import { S3Service } from './../src/s3/s3.service';
import { mailService } from './mocks/mail-service';
import { geocoderService } from './mocks/geocoder-service';
import { s3Service } from './mocks/s3-service';

import { INVALID_ACCESS_TOKEN, USER_ONE, USER_TWO } from './helpers/auth-data';
import {
  COMPANY_ONE,
  COMPANY_TWO,
  INVALID_COMPANY_ID,
} from './helpers/company-data';
import {
  BRANCH_ONE,
  BRANCH_TWO,
  COMPANY_ONE_BRANCHES,
  INVALID_BRANCH,
  INVALID_BRANCH_ID,
} from './helpers/branch-data';
import { COMPANY_ONE_OFFERS } from './helpers/offer-data';

describe('BranchController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminService: AdminService;
  let authService: AuthService;
  let cacheService: CacheService;
  let companyService: CompanyService;
  let branchService: BranchService;
  let offerService: OfferService;
  let addressRepository: AddressRepository;
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
    addressRepository = moduleFixture.get<AddressRepository>(AddressRepository);
    branchRepository = moduleFixture.get<BranchRepository>(BranchRepository);
    companyRepository = moduleFixture.get<CompanyRepository>(CompanyRepository);
    offerRepository = moduleFixture.get<OfferRepository>(OfferRepository);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    adminService = moduleFixture.get<AdminService>(AdminService);

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

  const createActiveUserAndCompany = async (
    userData: any,
    companyData: any,
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
      branches: createdBranches,
      offers,
      user: updatedUser,
      companyId: company.id,
    };
  };

  const getBranchesByCompanyIdFromDB = async (companyId: string) => {
    const [branches, count] = await branchRepository.findAndCount({
      where: { companyId },
    });
    return { branches, count };
  };

  const getBranchAddresFromDB = async (branchId: number) => {
    const address = await addressRepository.findOne({
      where: { branchId },
    });
    return address;
  };

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendCreateBranchRequest = async (
    token: string,
    companyId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .post(`/branches/${companyId}/create`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendGetCompanyBranchesRequest = async (
    token: string,
    companyId: string,
  ) => {
    const response = await request(app.getHttpServer())
      .get(`/branches/${companyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  const sendUpdateBranchRequest = async (
    token: string,
    companyId: string,
    branchId: number,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .patch(`/branches/${companyId}/${branchId}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendDeleteBranchRequest = async (
    token: string,
    companyId: string,
    branchId: number,
  ) => {
    const response = await request(app.getHttpServer())
      .delete(`/branches/${companyId}/${branchId}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  // ------------------------------- CREATE - Valid Request ------------------------------ \\

  describe('/branches/:companyId/create (POST) - Valid Request', () => {
    it('returns 201 status code', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );

      expect(response.status).toBe(201);
    });

    it('returns success message', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('creates new company in database', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      expect(branches[0]).toBeTruthy();
    });

    it('validate address using geocoder', async () => {
      const validateAddress = jest.spyOn(geocoderService, 'validateAddress');
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      expect(validateAddress).toHaveBeenCalled();
    });
  });

  // ------------------------------ CREATE - Invalid Request ----------------------------- \\

  describe('/branches/:companyId/create (POST) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        INVALID_BRANCH,
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when provided address is consider as invalid by geocoder', async () => {
      jest
        .spyOn(geocoderService, 'validateAddress')
        .mockImplementationOnce(async () => false);
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );
      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'name'}
      ${'country'}
      ${'region'}
      ${'postcode'}
      ${'city'}
      ${'streetName'}
      ${'houseNumber'}
      ${'lat'}
      ${'long'}
    `(
      'returns proper error message when $invalidField is invalid',
      async ({ invalidField }) => {
        const { accessToken, companyId } = await createActiveUserAndCompany(
          USER_ONE,
          COMPANY_ONE,
        );
        const branchBody = {
          ...BRANCH_ONE,
          address: { ...BRANCH_ONE.address },
        };

        if (invalidField === 'name') {
          branchBody[invalidField] = INVALID_BRANCH[invalidField];
        } else {
          branchBody.address[invalidField] =
            INVALID_BRANCH.address[invalidField];
        }

        const response = await sendCreateBranchRequest(
          accessToken,
          companyId,
          branchBody,
        );

        let errorMessage = null;

        if (invalidField === 'name') {
          errorMessage = response.body.message[invalidField];
        } else {
          errorMessage = response.body.message.address[invalidField];
        }

        expect(errorMessage).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      const { companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        BRANCH_ONE,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company belongs to another user', async () => {
      const { accessToken } = await createActiveUserAndCompany(
        USER_TWO,
        COMPANY_TWO,
      );
      const { companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );

      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company with given id does not exist', async () => {
      const { accessToken } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        INVALID_COMPANY_ID,
        BRANCH_ONE,
      );
      expect(response.status).toBe(404);
    });

    it('returns 502 status code when validation with goecoder fails', async () => {
      jest
        .spyOn(geocoderService, 'validateAddress')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );
      expect(response.status).toBe(502);
    });
  });

  // ----------------------- GET COMPANY BRANCHES - Valid Request ------------------------ \\

  describe('/branches/:companyId (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const response = await sendGetCompanyBranchesRequest(
        accessToken,
        companyId,
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const response = await sendGetCompanyBranchesRequest(
        accessToken,
        companyId,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object with payload', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const response = await sendGetCompanyBranchesRequest(
        accessToken,
        companyId,
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns branch data', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const response = await sendGetCompanyBranchesRequest(
        accessToken,
        companyId,
      );
      expect(Object.keys(response.body.data[0])).toEqual([
        'id',
        'name',
        'createdAt',
        'address',
      ]);
      expect(Object.keys(response.body.data[0].address)).toEqual([
        'id',
        'country',
        'region',
        'postcode',
        'city',
        'streetName',
        'houseNumber',
        'lat',
        'long',
      ]);
    });

    it('returns empty array when company does not have any branches', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendGetCompanyBranchesRequest(
        accessToken,
        companyId,
      );
      expect(response.body.data).toEqual([]);
    });
  });

  // ---------------------- GET COMPANY BRANCHES - Invalid Request ----------------------- \\

  describe('/branches/:companyId (GET) - Invalid Request', () => {
    it('returns 400 status when company id is not a valid uuid', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const response = await sendGetCompanyBranchesRequest(
        accessToken,
        'INVALID_COMPANY_ID',
      );
      expect(response.status).toBe(400);
    });
  });

  // ------------------------------- UPDATE - Valid Request ------------------------------ \\

  describe('/branches/:companyId/:branchId/update (PATCH) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('updates company in database', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);

      await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );
      const { branches: updatedBranches } =
        await getBranchesByCompanyIdFromDB(companyId);

      expect(branches[0]).not.toBe(updatedBranches[0]);
    });

    it('validate address using geocoder', async () => {
      const validateAddress = jest.spyOn(geocoderService, 'validateAddress');
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );
      expect(validateAddress).toHaveBeenCalled();
    });
  });

  // ------------------------------ UPDATE - Invalid Request ----------------------------- \\

  describe('/branches/:companyId/:branchId/update (PATCH) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        INVALID_BRANCH,
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when empty object is provided as body', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        {},
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when provided address is consider as invalid by geocoder', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      jest
        .spyOn(geocoderService, 'validateAddress')
        .mockImplementationOnce(async () => false);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
        BRANCH_ONE,
      );
      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'name'}
      ${'country'}
      ${'region'}
      ${'postcode'}
      ${'city'}
      ${'streetName'}
      ${'houseNumber'}
      ${'lat'}
      ${'long'}
    `(
      'returns proper error message when $invalidField is invalid',
      async ({ invalidField }) => {
        const { accessToken, companyId } = await createActiveUserAndCompany(
          USER_ONE,
          COMPANY_ONE,
        );
        await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
        const { branches } = await getBranchesByCompanyIdFromDB(companyId);
        const branchBody = {
          ...BRANCH_ONE,
          address: { ...BRANCH_ONE.address },
        };

        if (invalidField === 'name') {
          branchBody[invalidField] = INVALID_BRANCH[invalidField];
        } else {
          branchBody.address[invalidField] =
            INVALID_BRANCH.address[invalidField];
        }

        const response = await sendUpdateBranchRequest(
          accessToken,
          companyId,
          branches[0].id,
          branchBody,
        );

        let errorMessage = null;

        if (invalidField === 'name') {
          errorMessage = response.body.message[invalidField];
        } else {
          errorMessage = response.body.message.address[invalidField];
        }

        expect(errorMessage).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company belongs to another user', async () => {
      const { accessToken: tokenOne, companyId } =
        await createActiveUserAndCompany(USER_ONE, COMPANY_ONE);
      await sendCreateBranchRequest(tokenOne, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);

      const { accessToken: tokenTwo } = await createActiveUserAndCompany(
        USER_TWO,
        COMPANY_TWO,
      );

      const response = await sendUpdateBranchRequest(
        tokenTwo,
        companyId,
        branches[0].id,
        BRANCH_TWO,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when company with given id does not exist', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        INVALID_COMPANY_ID,
        branches[0].id,
        BRANCH_TWO,
      );
      expect(response.status).toBe(404);
    });

    it('returns 404 status code when branch with given id does not exist', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendUpdateBranchRequest(
        accessToken,
        companyId,
        INVALID_BRANCH_ID,
        BRANCH_TWO,
      );
      expect(response.status).toBe(404);
    });

    it('returns 502 status code when validation with goecoder fails', async () => {
      jest
        .spyOn(geocoderService, 'validateAddress')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      const response = await sendCreateBranchRequest(
        accessToken,
        companyId,
        BRANCH_ONE,
      );
      expect(response.status).toBe(502);
    });
  });

  // ------------------------------- DELETE - Valid Request ------------------------------ \\

  describe('/branches/:companyId/:branchId/delete (DELETE) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('deletes branch from the database', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      await sendDeleteBranchRequest(accessToken, companyId, branches[0].id);
      const { branches: branchesAfterDelete } =
        await getBranchesByCompanyIdFromDB(companyId);

      expect(branchesAfterDelete).toEqual([]);
    });

    it('deletes addresses associated with branch from the database', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);

      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const addressBefore = await getBranchAddresFromDB(branches[0].id);
      await sendDeleteBranchRequest(accessToken, companyId, branches[0].id);
      const addressAftere = await getBranchAddresFromDB(branches[0].id);

      expect(addressBefore).toBeTruthy();
      expect(addressAftere).toBeNull();
    });
  });

  // ------------------------------ DELETE - Invalid Request ----------------------------- \\

  describe('/branches/:companyId/:branchId/delete (DELETE) - Invalid Request', () => {
    it('returns 400 status when company id is not a valid uuid', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        'companyId',
        branches[0].id,
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status when branch id is not an integer', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        companyId,
        2000.111332,
      );
      expect(response.status).toBe(400);
    });

    it('returns 401 status code when access token is invalid', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        INVALID_ACCESS_TOKEN,
        companyId,
        branches[0].id,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when company belongs to another user', async () => {
      const { accessToken: tokenOne, companyId } =
        await createActiveUserAndCompany(USER_ONE, COMPANY_ONE);
      await sendCreateBranchRequest(tokenOne, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);

      const { accessToken: tokenTwo } = await createActiveUserAndCompany(
        USER_TWO,
        COMPANY_TWO,
      );

      const response = await sendDeleteBranchRequest(
        tokenTwo,
        companyId,
        branches[0].id,
      );

      expect(response.status).toBe(403);
    });

    it('returns 403 status code when branch is associated with offers', async () => {
      const { accessToken, companyId, branches } =
        await createUserAndCompanyWithOffers(
          USER_ONE,
          COMPANY_ONE,
          COMPANY_ONE_BRANCHES,
          COMPANY_ONE_OFFERS,
        );

      const response = await sendDeleteBranchRequest(
        accessToken,
        companyId,
        branches[0].id,
      );

      expect(response.status).toBe(403);
    });

    it('returns 404 status code when the company ID does not match the ID provided as a parameter', async () => {
      const { accessToken: tokenOne, companyId } =
        await createActiveUserAndCompany(USER_ONE, COMPANY_ONE);
      await sendCreateBranchRequest(tokenOne, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);

      const { accessToken: tokenTwo, companyId: secondCompanyId } =
        await createActiveUserAndCompany(USER_TWO, COMPANY_TWO);

      const response = await sendDeleteBranchRequest(
        tokenTwo,
        secondCompanyId,
        branches[0].id,
      );

      expect(response.status).toBe(404);
    });

    it('returns 404 status code when company with given id does not exist', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      const { branches } = await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        INVALID_COMPANY_ID,
        branches[0].id,
      );
      expect(response.status).toBe(404);
    });

    it('returns 404 status code when branch with given id does not exist', async () => {
      const { accessToken, companyId } = await createActiveUserAndCompany(
        USER_ONE,
        COMPANY_ONE,
      );
      await sendCreateBranchRequest(accessToken, companyId, BRANCH_ONE);
      await getBranchesByCompanyIdFromDB(companyId);
      const response = await sendDeleteBranchRequest(
        accessToken,
        companyId,
        INVALID_BRANCH_ID,
      );
      expect(response.status).toBe(404);
    });
  });
});
