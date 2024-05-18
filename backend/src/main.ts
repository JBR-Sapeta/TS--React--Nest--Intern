import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggerFactory } from './common/classes';

// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s
// https://www.youtube.com/watch?v=52nqjrCs57s

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
