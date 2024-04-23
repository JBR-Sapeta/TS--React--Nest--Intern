import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CategoriesDto } from './dto/response';

import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  getCategories(): Promise<CategoriesDto> {
    return this.categoryService.getCategories();
  }
}
