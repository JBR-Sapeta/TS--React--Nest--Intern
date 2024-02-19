import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { ENV_KEYS } from '../common/constants';

@Injectable()
export class MailService {
  constructor(
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
        subject: `Welcome ${firstName}`,
        template: 'welcome.ejs',
        context: {
          domainUrl: this.configService.get<string>(ENV_KEYS.DOMAIN_URL),
          activationToken,
          firstName,
        },
      });
    } catch (error) {
      throw new BadGatewayException('Sending email failed.');
    }
  }
}
