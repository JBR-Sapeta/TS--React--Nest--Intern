import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SuccessMessageDto } from '../common/classes';
import { DateParams } from '../common/classes/params';

import { AdminService } from './admin.service';

@ApiTags('App')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/logs')
  @HttpCode(HttpStatus.OK)
  rootPage(@Query() dateParams: DateParams): Promise<SuccessMessageDto> {
    return this.adminService.getLogs(dateParams);
  }
}
