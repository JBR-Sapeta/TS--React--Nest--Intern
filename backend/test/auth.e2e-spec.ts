import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

import { Roles } from './../src/common/enums';
import { calculateExpirationDate } from './../src/common/functions';
import { AppModule } from './../src/app.module';
import { UserRepository } from './../src/repositories';
import { CacheService } from './../src/cache/cache.service';
import { MailService } from './../src/mail/mail.service';
import { AuthService } from './../src/auth/auth.service';

import {
  RANDOM_UUID,
  USER_ONE,
  USER_ONE_CREDENTIALS,
  VALID_SIGN_UP_DATA,
  INVALID_SIGN_UP_DATA,
  INVALID_ACCESS_TOKEN,
  USER_TWO,
} from './helpers/auth-data';
import type { User, Credentials } from './helpers/auth-data';
import { mailService } from './mocks/mail-service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let authService: AuthService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [MailService],
    })
      .overrideProvider(MailService)
      .useValue(mailService)
      .compile();

    app = moduleFixture.createNestApplication();

    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    cacheService = moduleFixture.get<CacheService>(CacheService);
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

  const createInactiveUser = async (userData: any) => {
    await authService.createUserAccount(userData);
    const user = await userRepository.findOne({
      where: { email: userData.email },
    });
    return user;
  };

  const createActiveUser = async (userData: any) => {
    await authService.createUserAccount(userData);
    const user = await userRepository.findOne({
      where: { email: userData.email },
    });
    user.activationToken = null;
    user.isActive = true;

    const updatedUser = await userRepository.save(user);
    return updatedUser;
  };

  const createActiveUserWithRecoveryToken = async (
    userData: any,
    expirationTime: number,
  ) => {
    await authService.createUserAccount(userData);
    const user = await userRepository.findOne({
      where: { email: userData.email },
    });
    user.activationToken = null;
    user.isActive = true;
    user.resetToken = uuid();
    user.resetTokenExpirationDate = calculateExpirationDate(expirationTime);

    const updatedUser = await userRepository.save(user);
    return updatedUser;
  };

  const getUserFromDB = async (email: string) => {
    const user = await userRepository.findOne({
      where: { email },
    });
    return user;
  };

  // ------------------------------------  Requests  ------------------------------------- \\

  const sendSignUpRequest = async (data: User) => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(data);
    return response;
  };

  const sendActivationRequest = async (token: string) => {
    const response = await request(app.getHttpServer())
      .post(`/auth/activation/${token}`)
      .send();
    return response;
  };

  const sendLoginRequest = async (data: Partial<Credentials>) => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(data);
    return response;
  };

  const sendRefreshTokenRequest = async (token: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  const sendLogoutRequest = async (token: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send();
    return response;
  };

  const sendAccountRecoveryRequest = async (email: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/account-recovery')
      .send({ email });
    return response;
  };

  const sendResetPasswordRequest = async (
    resetToken: string,
    password: string,
  ) => {
    const response = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({ resetToken, password });
    return response;
  };

  const sendRresendActivationEmailRequest = async (email: string) => {
    const response = await request(app.getHttpServer())
      .post('/auth/resend-activation-email')
      .send({ email });
    return response;
  };

  // ------------------------------ Signup - Valid Request ------------------------------ \\

  describe('/auth/signup (POST) - Valid Request', () => {
    it('returns 201 status code', async () => {
      const response = await sendSignUpRequest(VALID_SIGN_UP_DATA);
      expect(response.status).toBe(201);
    });

    it('returns success message', async () => {
      const response = await sendSignUpRequest(VALID_SIGN_UP_DATA);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const response = await sendSignUpRequest(VALID_SIGN_UP_DATA);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('it creates user entity in databas', async () => {
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const user = await getUserFromDB(VALID_SIGN_UP_DATA.email);
      expect(user).toBeTruthy();
    });

    it('saves hashed password in database', async () => {
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const user = await getUserFromDB(VALID_SIGN_UP_DATA.email);
      expect(user.password).not.toBe(VALID_SIGN_UP_DATA.password);
    });

    it('creates user with isActive property set to false', async () => {
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const user = await getUserFromDB(VALID_SIGN_UP_DATA.email);
      expect(user.isActive).toBe(false);
    });

    it('assigns user role to created entity', async () => {
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const user = await getUserFromDB(VALID_SIGN_UP_DATA.email);
      expect(user.roles[0].id).toBe(Roles.USER);
    });

    it('creates an activationToken for user', async () => {
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const user = await getUserFromDB(VALID_SIGN_UP_DATA.email);
      expect(user.activationToken).toBeTruthy();
    });

    it('sends an activation email with activationToken', async () => {
      const sendWelcomeEmail = jest.spyOn(mailService, 'sendWelcomeEmail');
      const { email, firstName } = VALID_SIGN_UP_DATA;
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const user = await getUserFromDB(VALID_SIGN_UP_DATA.email);
      expect(sendWelcomeEmail).toHaveBeenCalledWith(
        email,
        firstName,
        user.activationToken,
      );
    });
  });

  // ------------------------------ Signup - Invalid Request ------------------------------ \\

  describe('/auth/signup (POST) - Invalid Request', () => {
    it('returns 400 status code when validation fails', async () => {
      const response = await sendSignUpRequest(INVALID_SIGN_UP_DATA);
      expect(response.status).toBe(400);
    });

    it.each`
      invalidField
      ${'firstName'}
      ${'lastName'}
      ${'password'}
      ${'email'}
    `(
      'returns proper error message when $invalidField is invalid',
      async ({ invalidField }) => {
        const user = { ...VALID_SIGN_UP_DATA };
        user[invalidField] = INVALID_SIGN_UP_DATA[invalidField];
        const response = await sendSignUpRequest(user);
        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it(`returns error when provided email is already taken`, async () => {
      await sendSignUpRequest(VALID_SIGN_UP_DATA);
      const response = await sendSignUpRequest(VALID_SIGN_UP_DATA);
      expect(response.status).not.toBe(201);
    });

    it(`returns a 502 status code when the sending of the activation email fails`, async () => {
      jest
        .spyOn(mailService, 'sendWelcomeEmail')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });
      const response = await sendSignUpRequest(VALID_SIGN_UP_DATA);
      expect(response.status).toBe(502);
    });
  });

  // ------------------------------ Account Activation - Valid Request ------------------------------ \\

  describe('/activate/:token (POST) - Valid Request', () => {
    it('returns 200 status code when', async () => {
      const user = await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(user.activationToken);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const user = await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(user.activationToken);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const user = await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(user.activationToken);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('sets activationToken in database to null', async () => {
      const user = await createInactiveUser(USER_ONE);
      await sendActivationRequest(user.activationToken);
      const activatedUser = await getUserFromDB(USER_ONE.email);
      expect(activatedUser.activationToken).toBeFalsy();
    });

    it('sets isActive in database to true', async () => {
      const user = await createInactiveUser(USER_ONE);
      await sendActivationRequest(user.activationToken);
      const activatedUser = await getUserFromDB(USER_ONE.email);
      expect(activatedUser.isActive).toBeTruthy();
    });
  });

  // ------------------------------ Account Activation - Invalid Request ------------------------------ \\

  describe('/activate/:token (POST) - Inalid Request', () => {
    it('returns 200 status code', async () => {
      const user = await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(user.activationToken);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      const user = await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(user.activationToken);
      expect(response.body.message).toBeTruthy();
    });

    it('sets activationToken in database to null', async () => {
      const user = await createInactiveUser(USER_ONE);
      await sendActivationRequest(user.activationToken);
      const activatedUser = await getUserFromDB(USER_ONE.email);
      expect(activatedUser.activationToken).toBeFalsy();
    });

    it('sets isActive in database to true', async () => {
      const user = await createInactiveUser(USER_ONE);
      await sendActivationRequest(user.activationToken);
      const activatedUser = await getUserFromDB(USER_ONE.email);
      expect(activatedUser.isActive).toBeTruthy();
    });
  });

  describe('/activate/:token (POST) - Inalid Request', () => {
    it('returns 403 status code when activation token is invalid', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(RANDOM_UUID);
      expect(response.status).toBe(403);
    });

    it('returns validation errro message when activation token is not valid uuid', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest('RANDOM_STRING');
      expect(response.body.message).toBeTruthy();
    });

    it('returns errro message when activation token is invalid', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendActivationRequest(RANDOM_UUID);
      expect(response.body.message).toBeTruthy();
    });

    it("doesn't set activationToken in database to null", async () => {
      await createInactiveUser(USER_ONE);
      await sendActivationRequest(RANDOM_UUID);
      const user = await getUserFromDB(USER_ONE.email);
      expect(user.activationToken).toBeTruthy();
    });

    it("doesn't sets isActive in database to true", async () => {
      await createInactiveUser(USER_ONE);
      await sendActivationRequest(RANDOM_UUID);
      const user = await getUserFromDB(USER_ONE.email);
      expect(user.isActive).toBeFalsy();
    });
  });

  // ------------------------------  Login - Valid Request  ------------------------------ \\

  describe('/login (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest(USER_ONE_CREDENTIALS);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest(USER_ONE_CREDENTIALS);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object with data field', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest(USER_ONE_CREDENTIALS);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns data field which contains accesToken and refreshTokenw', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest(USER_ONE_CREDENTIALS);
      expect(Object.keys(response.body.data)).toEqual([
        'accessToken',
        'refreshToken',
      ]);
    });
  });

  // ------------------------------ Login - Invalid Request ------------------------------ \\

  describe('/login (POST) - Invalid Request', () => {
    it('returns 400 status code when email field is invalid', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest({
        email: 'INVALID_EMAIL',
        password: USER_ONE.email,
      });
      expect(response.status).toBe(400);
    });

    it('returns 401 status code when provided email is inccorect', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest({
        ...USER_ONE_CREDENTIALS,
        email: 'invalid@mail.com',
      });
      expect(response.status).toBe(401);
    });

    it('returns 401 when password is incorrect', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendLoginRequest({
        email: USER_ONE.email,
        password: 'INVALID_PASSWORD',
      });
      expect(response.status).toBe(401);
    });

    it('returns 401 status code when user does not exist', async () => {
      const response = await sendLoginRequest(USER_ONE_CREDENTIALS);
      expect(response.status).toBe(401);
    });

    it('returns 403 status code when user account is inactive', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendLoginRequest(USER_ONE_CREDENTIALS);
      expect(response.status).toBe(403);
    });
  });

  // ------------------------------  Refrsh Token - Valid Request  ------------------------------ \\

  describe('/refresh (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendRefreshTokenRequest(data.refreshToken.token);
      expect(response.status).toBe(200);
    });

    it('returns success message', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendRefreshTokenRequest(data.refreshToken.token);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object with data field', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendRefreshTokenRequest(data.refreshToken.token);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
        'data',
      ]);
    });

    it('returns data field which contains new accesToken', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendRefreshTokenRequest(data.refreshToken.token);
      expect(Object.keys(response.body.data)).toEqual(['accessToken']);
    });
  });

  // ------------------------------ Refrsh Token - Invalid Request ------------------------------ \\

  describe('/refresh (POST) - Invalid Request', () => {
    it('returns 401 status code when refresh token is invalid', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendRefreshTokenRequest('INVALID_REFRESH_TOKEN');
      expect(response.status).toBe(401);
    });
  });

  // ------------------------------  Logout - Valid Request  ------------------------------ \\

  describe('/logout (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendLogoutRequest(data.accessToken);
      expect(response.status).toBe(200);
    });

    it('returns succcess message', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendLogoutRequest(data.accessToken);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendLogoutRequest(data.accessToken);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('sets refreshToken to null in database ', async () => {
      await createActiveUser(USER_ONE);
      const {
        body: { data },
      } = await sendLoginRequest(USER_ONE_CREDENTIALS);
      await sendLogoutRequest(data.accessToken);
      const user = await getUserFromDB(USER_ONE.email);
      expect(user.refreshToken).toBe(null);
    });
  });

  // ------------------------------ Logout - Invalid Request ------------------------------ \\

  describe('/logout (POST) - Invalid Request', () => {
    it('returns 401 status code when access token is invalid', async () => {
      await createActiveUser(USER_ONE);
      await sendLoginRequest(USER_ONE_CREDENTIALS);
      const response = await sendLogoutRequest(INVALID_ACCESS_TOKEN);
      expect(response.status).toBe(401);
    });
  });

  // -------------------------  Account Recovery - Valid Request  ------------------------- \\

  describe('/account-recovery (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendAccountRecoveryRequest(USER_ONE.email);
      expect(response.status).toBe(200);
    });

    it('returns succcess message', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendAccountRecoveryRequest(USER_ONE.email);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendAccountRecoveryRequest(USER_ONE.email);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('creates resetToken in database', async () => {
      await createActiveUser(USER_ONE);
      await sendAccountRecoveryRequest(USER_ONE.email);
      const user = await getUserFromDB(USER_ONE.email);
      expect(user.resetToken).toBeTruthy();
    });

    it('creates resetTokenExpirationDate in database', async () => {
      await createActiveUser(USER_ONE);
      await sendAccountRecoveryRequest(USER_ONE.email);
      const user = await getUserFromDB(USER_ONE.email);
      expect(user.resetTokenExpirationDate).toBeTruthy();
    });

    it('sends an account recovery email with resetToken', async () => {
      const sendWelcomeEmail = jest.spyOn(mailService, 'sendRecoveryEmail');
      await createActiveUser(USER_ONE);
      await sendAccountRecoveryRequest(USER_ONE.email);
      const user = await getUserFromDB(USER_ONE.email);
      expect(sendWelcomeEmail).toHaveBeenCalledWith(
        user.email,
        user.firstName,
        user.resetToken,
      );
    });
  });

  // ------------------------ Account Recovery - Invalid Request ------------------------- \\

  describe('/account-recovery (POST) - Invalid Request', () => {
    it('returns 400 status code when request is send with invalid e-mail', async () => {
      const response = await sendAccountRecoveryRequest('INVALID_EMAIL');
      expect(response.status).toBe(400);
    });

    it('returns 404 status code when request is send with unknown e-mail', async () => {
      const response = await sendAccountRecoveryRequest(USER_ONE.email);
      expect(response.status).toBe(404);
    });

    it('returns a 502 status code when the sending of the recovery email fails`', async () => {
      jest
        .spyOn(mailService, 'sendRecoveryEmail')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });
      await createActiveUser(USER_ONE);
      const response = await sendAccountRecoveryRequest(USER_ONE.email);
      expect(response.status).toBe(502);
    });
  });

  // ------------------------- Reset Password - Valid Request ---------------------------- \\

  describe('/reset-password (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      const response = await sendResetPasswordRequest(
        user.resetToken,
        USER_TWO.password,
      );
      expect(response.status).toBe(200);
    });

    it('returns succcess message', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      const response = await sendResetPasswordRequest(
        user.resetToken,
        USER_TWO.password,
      );
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      const response = await sendResetPasswordRequest(
        user.resetToken,
        USER_TWO.password,
      );
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('sets new password in database', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      await sendResetPasswordRequest(user.resetToken, USER_TWO.password);
      const updatedUser = await getUserFromDB(USER_ONE.email);
      expect(user.password).not.toBe(updatedUser.password);
    });

    it('sets resetToken to null', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      await sendResetPasswordRequest(user.resetToken, USER_TWO.password);
      const updatedUser = await getUserFromDB(USER_ONE.email);
      expect(updatedUser.resetToken).toBe(null);
    });

    it('sets resetTokenExpirationDate to null', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      await sendResetPasswordRequest(user.resetToken, USER_TWO.password);
      const updatedUser = await getUserFromDB(USER_ONE.email);
      expect(updatedUser.resetTokenExpirationDate).toBe(null);
    });
  });

  // ------------------------- Reset Password - Invalid Request -------------------------- \\

  describe('/reset-password (POST) - Invalid Request', () => {
    it('returns 400 status code when password is not strong enough', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      const response = await sendResetPasswordRequest(user.resetToken, 'Pass');
      expect(response.status).toBe(400);
    });

    it('returns 400 status code when resetToken is not provided', async () => {
      const response = await sendResetPasswordRequest('', USER_TWO.password);
      expect(response.status).toBe(400);
    });

    it('returns 403 status code when resetToken is invalid', async () => {
      await createActiveUserWithRecoveryToken(USER_ONE, 3600);
      const response = await sendResetPasswordRequest(
        RANDOM_UUID,
        USER_TWO.password,
      );
      expect(response.status).toBe(403);
    });

    it('returns 403 status code when resetToken expired', async () => {
      const user = await createActiveUserWithRecoveryToken(USER_ONE, -3600);
      const response = await sendResetPasswordRequest(
        user.resetToken,
        USER_TWO.password,
      );
      expect(response.status).toBe(403);
    });
  });

  // ---------------------- Resend Activation Email - Valid Request ---------------------- \\

  describe('/resend-activation-email (POST) - Valid Request', () => {
    it('returns 200 status code', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendRresendActivationEmailRequest(USER_ONE.email);
      expect(response.status).toBe(200);
    });

    it('returns succcess message', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendRresendActivationEmailRequest(USER_ONE.email);
      expect(response.body.message).toBeTruthy();
    });

    it('returns proper success response object', async () => {
      await createInactiveUser(USER_ONE);
      const response = await sendRresendActivationEmailRequest(USER_ONE.email);
      expect(Object.keys(response.body)).toEqual([
        'stausCode',
        'message',
        'error',
      ]);
    });

    it('resends an activation email with activationToken', async () => {
      const sendWelcomeEmail = jest.spyOn(mailService, 'sendWelcomeEmail');
      const user = await createInactiveUser(USER_ONE);
      expect(sendWelcomeEmail).toHaveBeenCalledWith(
        user.email,
        user.firstName,
        user.activationToken,
      );
    });
  });

  // --------------------- Resend Activation Email - Invalid Request --------------------- \\

  describe('/resend-activation-email (POST) - Invalid Request', () => {
    it('returns 400 status code when request is send with invalid e-mail', async () => {
      const response = await sendRresendActivationEmailRequest('INVALID_EMAIL');
      expect(response.status).toBe(400);
    });

    it('returns 403 status code when request is send for active user', async () => {
      await createActiveUser(USER_ONE);
      const response = await sendRresendActivationEmailRequest(USER_ONE.email);
      expect(response.status).toBe(403);
    });

    it('returns a 502 status code when the sending email fails', async () => {
      await createInactiveUser(USER_ONE);
      jest
        .spyOn(mailService, 'sendWelcomeEmail')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });
      const response = await sendRresendActivationEmailRequest(USER_ONE.email);
      expect(response.status).toBe(502);
    });
  });
});
