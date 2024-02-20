import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { UserRepository, UserRoleRepository } from './../src/repositories';
import { MailService } from './../src/mail/mail.service';
import { Roles } from './../src/common/enums';

import { INVALID_USER_DATA, VALID_USER_DATA } from './helpers/auth-data';
import { mailService } from './mocks/mail-service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let userRolesRepository: UserRoleRepository;

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
    userRolesRepository =
      moduleFixture.get<UserRoleRepository>(UserRoleRepository);

    await userRolesRepository.seedRoles();
    await app.init();
  });

  // ------------------------------ Signup - Valid Request ------------------------------ \\

  describe('/auth/signup (POST) - Valid Request', () => {
    jest
      .spyOn(mailService, 'sendWelcomeEmail')
      .mockImplementation(async () => {});

    it('returns 201 status code when request is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      expect(response.status).toBe(201);
    });

    it('returns succes message when signup request is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      expect(response.body.message).toBeTruthy();
    });

    it('it creates user entity in databas', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const user = await userRepository.findOneBy({
        email: VALID_USER_DATA.email,
      });

      expect(user).toBeTruthy();
    });

    it('saves hashed password in database', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const user = await userRepository.findOneBy({
        email: VALID_USER_DATA.email,
      });

      expect(user.password).not.toBe(VALID_USER_DATA.password);
    });

    it('creates user with isActive property set to false', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const user = await userRepository.findOneBy({
        email: VALID_USER_DATA.email,
      });

      expect(user.isActive).toBe(false);
    });

    it('assigns user role to created entity', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const user = await userRepository.findOne({
        where: { email: VALID_USER_DATA.email },
        relations: { roles: true },
      });

      expect(user.roles[0].id).toBe(Roles.USER);
    });

    it('creates an activationToken for user', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const user = await userRepository.findOneBy({
        email: VALID_USER_DATA.email,
      });

      expect(user.activationToken).toBeTruthy();
    });

    it('sends an activation email with activationToken', async () => {
      const { email, firstName } = VALID_USER_DATA;

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const sendWelcomeEmail = jest.spyOn(mailService, 'sendWelcomeEmail');

      const user = await userRepository.findOneBy({ email });

      expect(sendWelcomeEmail).toHaveBeenCalledWith(
        email,
        firstName,
        user.activationToken,
      );
    });
  });

  // ------------------------------ Signup - Invalid Request ------------------------------ \\

  describe('/auth/signup (POST) - Invalid Request', () => {
    jest
      .spyOn(mailService, 'sendWelcomeEmail')
      .mockImplementation(async () => {});

    it('returns 400 status code when validation fails', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(INVALID_USER_DATA);

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
        const user = { ...VALID_USER_DATA };
        user[invalidField] = INVALID_USER_DATA[invalidField];

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(user);

        expect(response.body.message[invalidField]).toBeTruthy();
      },
    );

    it(`returns error when provided email is already taken`, async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      expect(response.status).toBe(500);
    });

    it(`returns a 502 status code when the sending of the activation email fails`, async () => {
      jest
        .spyOn(mailService, 'sendWelcomeEmail')
        .mockImplementationOnce(async () => {
          throw new BadGatewayException();
        });

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(VALID_USER_DATA);

      expect(response.status).toBe(502);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
