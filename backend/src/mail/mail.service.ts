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
  private domainUrl: string;
  private senderAddrerss: string;

  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.domainUrl = this.configService.get<string>(ENV_KEYS.DOMAIN_URL);
    this.senderAddrerss = this.configService.get<string>(
      ENV_KEYS.MAIL_SENDER_ADDRESS,
    );
  }

  public async sendWelcomeEmail(
    email: string,
    firstName: string,
    activationToken: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.senderAddrerss,
        subject: `Welcome message`,
        template: 'welcome.ejs',
        context: {
          domainUrl: this.domainUrl,
          activationToken,
          firstName,
        },
      });
    } catch (error) {
      this.logger.error(MailService.name + ' - sendWelcomeEmail', error.stack);

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
        from: this.senderAddrerss,
        subject: `Welcome message`,
        template: 'recovery.ejs',
        context: {
          domainUrl: this.configService.get<string>(ENV_KEYS.DOMAIN_URL),
          resetToken,
          firstName,
        },
      });
    } catch (error) {
      this.logger.error(MailService.name + ' - sendRecoveryEmail', error.stack);

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_EMAIL_DELIVERY);
    }
  }
}
