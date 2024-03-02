import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { ENV_KEYS } from '../common/constants';
import { PL_ERRORS } from '../locales';

@Injectable()
export class MailService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendWelcomeEmail(
    email: string,
    firstName: string,
    activationToken: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>(ENV_KEYS.MAIL_FROM),
        subject: `Welcome message`,
        template: 'welcome.ejs',
        context: {
          domainUrl: this.configService.get<string>(ENV_KEYS.DOMAIN_URL),
          activationToken,
          firstName,
        },
      });
    } catch (error) {
      this.logger.error(
        MailService.name,
        'sendWelcomeEmail',
        error.message,
        error.stack,
      );

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_EMAIL_DELIVERY);
    }
  }

  public async sendRecoveryEmail(
    email: string,
    firstName: string,
    resetToken: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>(ENV_KEYS.MAIL_FROM),
        subject: `Welcome message`,
        template: 'recovery.ejs',
        context: {
          domainUrl: this.configService.get<string>(ENV_KEYS.DOMAIN_URL),
          resetToken,
          firstName,
        },
      });
    } catch (error) {
      this.logger.error(
        MailService.name,
        'sendRecoveryEmail',
        error.message,
        error.stack,
      );

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_EMAIL_DELIVERY);
    }
  }
}
