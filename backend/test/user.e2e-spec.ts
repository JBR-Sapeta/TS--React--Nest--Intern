import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { AppModule } from './../src/app.module';
import { UserRepository } from './../src/repositories';
import { CacheService } from './../src/cache/cache.service';
import { MailService } from './../src/mail/mail.service';
import { GeocoderService } from './../src/geocoder/geocoder.service';
import { AuthService } from './../src/auth/auth.service';
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

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let cacheService: CacheService;
  let userRepository: UserRepository;
  let authService: AuthService;

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
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    cacheService = moduleFixture.get<CacheService>(CacheService);
    authService = moduleFixture.get<AuthService>(AuthService);

    await app.init();
  });

  afterEach(async () => {
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

  const getUserFromDB = async (email: string) => {
    const user = await userRepository.findOne({
      where: { email },
      relations: { roles: true },
    });
    return user;
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
      .put(`/users/${userId}/update`)
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
      .put(`/users/${userId}/email`)
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
      .put(`/users/${userId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    return response;
  };

  const sendDeleteUserAccountRequest = async (
    token: string,
    userId: string,
    data: any,
  ) => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
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

  describe('/users/:userId/update (PUT) - Valid Request', () => {
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

    it('returns proper success response object with data field', async () => {
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
        'data',
      ]);
    });

    it('returns user data', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        VALID_UPDATE_PROFILE_DATA,
      );
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'roles',
        'createdAt',
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

  describe('/users/:userId/update (PUT) - Inalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserProfileRequest(
        accessToken,
        user.id,
        INVALID_UPDATE_PROFILE_DATA,
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

  describe('/users/:userId/email (PUT) - Valid Request', () => {
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

    it('returns proper success response object with data field', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns updated user data', async () => {
      const { user, accessToken } = await createActiveUser(USER_ONE);
      const response = await sendUpdateUserEmailRequest(accessToken, user.id, {
        ...VALID_NEW_EMAIL,
        password: USER_ONE.password,
      });
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'roles',
        'createdAt',
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

  describe('/users/:userId/email (PUT) - Invalid Request', () => {
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

  describe('/users/:userId/password (PUT) - Valid Request', () => {
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

  describe('/users/:userId/password (PUT) - Invalid Request', () => {
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

  describe('/users/:userId/delete (PUT) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        accessToken,
        user.id,
        { password: USER_ONE.password },
      );
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        accessToken,
        user.id,
        { password: USER_ONE.password },
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        accessToken,
        user.id,
        { password: USER_ONE.password },
      );
      expect(Object.keys(response.body)).toEqual([
        'statusCode',
        'message',
        'error',
      ]);
    });

    it('removes user from database', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      await sendDeleteUserAccountRequest(accessToken, user.id, {
        password: USER_ONE.password,
      });
      const userInDB = await getUserFromDB(USER_ONE.email);
      expect(userInDB).toEqual(null);
    });
  });

  // ------------------------------ Update - Invalid Request ------------------------------ \\

  describe('/users/:userId/delete (PUT) - Invalid Request', () => {
    it('returns 400 status code when current password is not provided', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        accessToken,
        user.id,
        { password: '' },
      );
      expect(response.status).toBe(400);
    });

    it('returns 401 status code when invalid password is provided', async () => {
      const { accessToken, user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        accessToken,
        user.id,
        { password: 'INVALID_PASSWORD' },
      );
      expect(response.status).toBe(401);
    });

    it('returns 401 status code when invalid access token is provided', async () => {
      const { user } = await createActiveUser(USER_ONE);
      const response = await sendDeleteUserAccountRequest(
        INVALID_ACCESS_TOKEN,
        user.id,
        { password: USER_ONE.password },
      );
      expect(response.status).toBe(401);
    });
  });
});
