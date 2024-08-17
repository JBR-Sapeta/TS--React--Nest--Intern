import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { LoggerFactory } from './common/classes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('App'),
  });

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    allowedHeaders: '*',
    credentials: true,
  });

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API descriptions.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
