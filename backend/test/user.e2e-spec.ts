import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { convertStringToBase64 } from '../src/common/functions';
import { OfferEntity } from './../src/entities';

import {
  ApplicationRepository,
  BranchRepository,
  CompanyRepository,
  OfferRepository,
  UserRepository,
} from './../src/repositories';

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

import { INVALID_ACCESS_TOKEN, USER_ONE, USER_TWO } from './helpers/auth-data';

import {
  INVALID_NEW_EMAIL,
  INVALID_NEW_PASSWORD,
  INVALID_UPDATE_PROFILE_DATA,
  VALID_NEW_EMAIL,
  VALID_NEW_PASSWORD,
  VALID_UPDATE_PROFILE_DATA,
} from './helpers/user-data';

import { mailService } from './mocks/mail-service';
import { geocoderService } from './mocks/geocoder-service';
import { s3Service } from './mocks/s3-service';
import { FILE_KEY } from './helpers/application-data';
import {
  COMPANY_ONE,
  COMPANY_ONE_LOGO_URL,
  COMPANY_ONE_MAIN_PHOTO_URL,
  INVALID_COMPANY_ID,
} from './helpers/company-data';
import { COMPANY_ONE_BRANCHES } from './helpers/branch-data';
import { COMPANY_ONE_OFFERS } from './helpers/offer-data';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminService: AdminService;
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
    adminService = moduleFixture.get<AdminService>(AdminService);
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
      const application = applicationRepository.create({
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

  const getUserFromDB = async (email: string) => {
    const user = await userRepository.findOne({
      where: { email },
      relations: { roles: true },
    });
    return user;
  };

  const getUserApplicationsFromDB = async (userId: string) => {
    const applications = await applicationRepository.find({
      where: { userId },
    });
    return applications;
  };

  const getUserCompanyFromDB = async (userId: string) => {
    const company = await companyRepository.findOne({
      where: { userId },
    });
    return company;
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

  const sendMeRequest = async (token: string) => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  const sendUpdateUserProfileRequest = async (
    token: string,
    userId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendUpdateUserEmailRequest = async (
    token: string,
    userId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}/email`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendUpdateUserPasswordRequest = async (
    token: string,
    userId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendDeleteUserAccountRequest = async (
    email: string,
    password: string,
    userId: string,
  ) => {
    const credentials = convertStringToBase64(`${email}:${password}`);

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}/delete`)
      .set('Authorization', `Basic ${credentials}`)
      .send();
    return response;
  };

  // ------------------------------ Me - Valid Request ------------------------------ \\

  describe('/users/me (GET) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendMeRequest(accessToken);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendMeRequest(accessToken);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object with data field', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendMeRequest(accessToken);
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns user data', async () => {
      const { accessToken } = await createActiveUser(USER_ONE);
      const response = await sendMeRequest(accessToken);
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'roles',
        'applications',
        'createdAt',
      ]);
    });
  });

  // ------------------------------ Me - Invalid Request ------------------------------ \\

  describe('/users/me (GET) - Invalid Request', () => {
    it('returns 401 status code when access token is not provided', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendMeRequest('');
      expect(response.status).toBe(401);
    });

    it('returns 401 status code when access token is invalid', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendMeRequest(INVALID_ACCESS_TOKEN);
      expect(response.status).toBe(401);
    });

    it('returns error message when access token is invalid', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendMeRequest(INVALID_ACCESS_TOKEN);
      expect(response.body.message).toBeTruthy();
    });
  });

  // ------------------------------ Update - Valid Request ------------------------------ \\

  describe('/users/:userId/update (PATCH) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('updates first name in database', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      const updatedUser = await getUserFromDB(user.email);
      expect(updatedUser.firstName).not.toBe(user.firstName);
    });

    it('updates last name in database', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      const updatedUser = await getUserFromDB(user.email);
      expect(updatedUser.lastName).not.toBe(user.lastName);
    });

    it('updates last name in database', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      const updatedUser = await getUserFromDB(user.email);
      expect(updatedUser.phoneNumber).not.toBe(user.phoneNumber);
    });
  });

  // ------------------------------ Update - Invalid Request ------------------------------ \\

  describe('/users/:userId/update (PATCH) - Inalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        INVALID_UPDATE_PROFILE_DATA,
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when empty object is provided as body', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        {},
      );
      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'firstName'}
      ${'lastName'}
      ${'phoneNumber'}
    `(
      'returns proper error message when $invalidField is invalid',
      async ({ invalidField }) => {
        const data = { ...VALID_UPDATE_PROFILE_DATA };
        data[invalidField] = INVALID_UPDATE_PROFILE_DATA[invalidField];
        const { user, accessToken } = await createActiveUser(USER_ONE);
        const response = await sendUpdateUserProfileRequest(
          accessToken,
          user.id,
          data,
        );
        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it('returns 401 status code when access token is invalid', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        INVALID_ACCESS_TOKEN,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      expect(response.status).toBe(401);
    });
  });

  // ------------------------------ Update Email - Valid Request ------------------------------ \\

  describe('/users/:userId/email (PATCH) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('saves new email address in database', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      const updatedUser = await getUserFromDB(VALID_NEW_EMAIL.newEmail);
      expect(updatedUser).toBeTruthy();
    });
  });

  // ------------------------------ Update Email - Invalid Request ------------------------------ \\

  describe('/users/:userId/email (PATCH) - Invalid Request', () => {
    it('returns 400 status code when invalid email address is provided', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...INVALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when password is not provided', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: '',
      });
      expect(response.status).toBe(400);
    });

    it('returns proper error message when email is invalid', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...INVALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(response.body.message.newEmail).toBeTruthy();
    });

    it('returns 401 status code when invalid password is provided', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: 'INVALID_PASSWORD',
      });
      expect(response.status).toBe(401);
    });

    it('returns 401 status code when access token is invalid', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(
        INVALID_ACCESS_TOKEN,
        user.id,
        {
          ...VALID_NEW_EMAIL,
          password: USER_ONE.password,
        },
      );
      expect(response.status).toBe(401);
    });

    it('returns error when new email address is already in use', async () => {
      await createActiveUser(USER_TWO);
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        newEmail: USER_TWO.email,
        password: USER_ONE.password,
      });
      expect(response.status).not.toBe(200);
    });
  });

  // ------------------------------ Update Password - Valid Request ------------------------------ \\

  describe('/users/:userId/password (PATCH) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserPasswordRequest(
        accessToken,
        user.id,
        {
          ...VALID_NEW_PASSWORD,
          password: USER_ONE.password,
        },
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserPasswordRequest(
        accessToken,
        user.id,
        {
          ...VALID_NEW_PASSWORD,
          password: USER_ONE.password,
        },
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserPasswordRequest(
        accessToken,
        user.id,
        {
          ...VALID_NEW_PASSWORD,
          password: USER_ONE.password,
        },
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('updates password in database', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      await sendUpdateUserPasswordRequest(accessToken, user.id, {
        ...VALID_NEW_PASSWORD,
        password: USER_ONE.password,
      });
      const updatedUser = await getUserFromDB(user.email);
      expect(updatedUser.password).not.toBe(user.password);
    });
  });

  // ------------------------------ Update Password - Invalid Request ------------------------------ \\

  describe('/users/:userId/password (PATCH) - Invalid Request', () => {
    it('returns 400 status code when new password validation fails', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserPasswordRequest(
        accessToken,
        user.id,
        {
          ...INVALID_NEW_PASSWORD,
          password: USER_ONE.password,
        },
      );
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when current password is not provided', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserPasswordRequest(
        accessToken,
        user.id,
        {
          ...VALID_NEW_PASSWORD,
          password: '',
        },
      );
      expect(response.status).toBe(400);
    });

    it('returns 401 status code when password is invalid', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_PASSWORD,
        password: 'INVALID_PASSWORD',
      });
      expect(response.body.message.newEmail).toBeTruthy();
    });

    it('returns 401 status code when access token is invalid', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(
        INVALID_ACCESS_TOKEN,
        user.id,
        {
          ...VALID_NEW_PASSWORD,
          password: USER_ONE.password,
        },
      );
      expect(response.status).toBe(401);
    });
  });

  // ------------------------------ Delete Account - Valid Request ------------------------------ \\

  describe('/users/:userId/delete (DELETE) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('removes user from database', async () => {
      const { user } = await createActiveUser(USER_ONE);
      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );
      const userInDB = await getUserFromDB(USER_ONE.email);
      expect(userInDB).toEqual(null);
    });

    it('deletes applications associated with user from database', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { user } = await createUserWithApplications(USER_TWO, offers);

      const applicationsBefore = await getUserApplicationsFromDB(user.id);

      await sendDeleteUserAccountRequest(
        USER_TWO.email,
        USER_TWO.password,
        user.id,
      );

      const applicationsAfter = await getUserApplicationsFromDB(user.id);

      expect(applicationsBefore).not.toEqual([]);
      expect(applicationsAfter).toEqual([]);
    });

    it('calls s3 service to delete applications files associated with user', async () => {
      const { offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { user } = await createUserWithApplications(USER_TWO, offers);

      const deleteImageFile = jest.spyOn(s3Service, 'deleteApplicationFile');

      await sendDeleteUserAccountRequest(
        USER_TWO.email,
        USER_TWO.password,
        user.id,
      );

      expect(deleteImageFile).toHaveBeenCalledTimes(2);
    });

    it('removes company from the database when user has one', async () => {
      const { user } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        [],
        [],
      );

      const companyBefore = await getUserCompanyFromDB(user.id);

      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );

      const companyAfter = await getUserCompanyFromDB(user.id);

      expect(companyBefore).toBeTruthy();
      expect(companyAfter).toBeNull();
    });

    it('removes company branches from the database when user has one', async () => {
      const { user, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        [],
      );

      const branchesBefore = await getCompanyBranchesFromDB(companyId);

      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );

      const branchesAfter = await getUserApplicationsFromDB(companyId);

      expect(branchesBefore).not.toEqual([]);
      expect(branchesAfter).toEqual([]);
    });

    it('removes company offers from the database when user has one', async () => {
      const { user, companyId } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const offersBefore = await getCompanyOffersFromDB(companyId);

      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );

      const offersAfter = await getUserApplicationsFromDB(companyId);

      expect(offersBefore).not.toEqual([]);
      expect(offersAfter).toEqual([]);
    });

    it('removes applications associated with user company from the database', async () => {
      const { user, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      const { user: applicationsOwner } = await createUserWithApplications(
        USER_TWO,
        offers,
      );

      const applicationsBefore = await getUserApplicationsFromDB(
        applicationsOwner.id,
      );

      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );

      const applicationsAfter = await getUserApplicationsFromDB(
        applicationsOwner.id,
      );

      expect(applicationsBefore).not.toEqual([]);
      expect(applicationsAfter).toEqual([]);
    });

    it('calls s3 service to delete image files associated with user company ', async () => {
      const { user } = await createUserWithCompany(
        USER_ONE,
        COMPANY_ONE,
        true,
        true,
      );
      const deleteImageFile = jest.spyOn(s3Service, 'deleteImageFile');

      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );

      expect(deleteImageFile).toHaveBeenCalledTimes(2);
    });

    it("calls the S3 service to delete application files associated with the user's company.", async () => {
      const { user, offers } = await createUserAndCompanyWithOffers(
        USER_ONE,
        COMPANY_ONE,
        COMPANY_ONE_BRANCHES,
        COMPANY_ONE_OFFERS,
      );

      await createUserWithApplications(USER_TWO, offers);

      const deleteImageFile = jest.spyOn(s3Service, 'deleteApplicationFile');

      await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        user.id,
      );

      expect(deleteImageFile).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------ Delete Account - Invalid Request ------------------------------ \\

  describe('/users/:userId/delete (DELETE) - Invalid Request', () => {
    it('returns 400 status code when invalid userID is provided as a param', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        'INVALID_ID',
      );
      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid password is provided', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        USER_ONE.email,
        'INVALID_PASSWORD',
        user.id,
      );
      expect(response.status).toBe(401);
    });

    it('returns 401 status code when invalid email is provided', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        'INVALID_EMAIL',
        USER_ONE.password,
        user.id,
      );
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when invalid userID is provided as a param', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        USER_ONE.email,
        USER_ONE.password,
        INVALID_COMPANY_ID,
      );
      expect(response.status).toBe(403);
    });
  });
});
