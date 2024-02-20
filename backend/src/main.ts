import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRoleRepository } from './repositories';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    allowedHeaders: '*',
    credentials: true,
  });
  await app.listen(8080);
  const userRoleRepository = app.get(UserRoleRepository);
  await userRoleRepository.seedRoles();
}
bootstrap();
