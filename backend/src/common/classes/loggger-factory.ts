import type { LoggerService } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

export const LoggerFactory = (appName: string): LoggerService => {
  let filename: string;

  if (process.env.NODE_ENV === 'prod') {
    filename = 'error.prod.log';
  } else if (process.env.NODE_ENV === 'dev') {
    filename = 'error.dev.log';
  } else {
    filename = 'error.log';
  }

  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(appName, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.File({
        filename,
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
};
