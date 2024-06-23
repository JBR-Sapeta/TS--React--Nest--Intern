import type { LoggerService } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

export const LoggerFactory = (appName: string): LoggerService => {
  let errorFilename: string;
  let infoFilename: string;

  if (process.env.NODE_ENV === 'prod') {
    errorFilename = 'error.prod.log';
    infoFilename = 'info.prod.log';
  } else if (process.env.NODE_ENV === 'dev') {
    errorFilename = 'error.dev.log';
    infoFilename = 'info.dev.log';
  } else if (process.env.NODE_ENV === 'test') {
    errorFilename = 'error.test.log';
    infoFilename = 'info.test.log';
  } else {
    errorFilename = 'error.log';
    infoFilename = 'info.log';
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
        filename: errorFilename,
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: infoFilename,
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
};
