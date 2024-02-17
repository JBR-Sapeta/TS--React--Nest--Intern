import { Injectable } from '@nestjs/common';
import { SuccesMessage } from './common/classes';

@Injectable()
export class AppService {
  getHello(): SuccesMessage {
    return new SuccesMessage({ message: 'Service is running.' });
  }
}
