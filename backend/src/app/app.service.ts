import { Injectable } from '@nestjs/common';
import { SuccessMessageDto } from '../common/classes';

@Injectable()
export class AppService {
  getHello(): SuccessMessageDto {
    return new SuccessMessageDto({ message: 'Service is running.' });
  }
}
