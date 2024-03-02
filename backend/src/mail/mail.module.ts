import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

import { ENV_KEYS } from '../common/constants';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: config.get<string>(ENV_KEYS.MAIL_HOST),
            port: +config.get<string>(ENV_KEYS.MAIL_PORT),
            secure: false,
            auth: {
              user: config.get<string>(ENV_KEYS.MAIL_AUTH_USER),
              pass: config.get<string>(ENV_KEYS.MAIL_AUTH_PASS),
            },
            tls: { rejectUnauthorized: false },
          },
          template: {
            dir: join(__dirname + '/templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [Logger, MailService],
  exports: [MailService],
})
export class MailModule {}
