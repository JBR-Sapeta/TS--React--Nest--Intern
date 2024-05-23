import { Logger, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [Logger, AdminService],
})
export class AdminModule {}
