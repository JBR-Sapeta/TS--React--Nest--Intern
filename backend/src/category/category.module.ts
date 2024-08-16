import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from '../entity';
import { CategoryRepository } from '../repository';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [Logger, CategoryService, CategoryRepository],
})
export class CategoryModule {}
