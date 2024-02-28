import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { SuccesMessage } from './common/classes';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  rootPage(): SuccesMessage {
    return this.appService.getHello();
  }
}
