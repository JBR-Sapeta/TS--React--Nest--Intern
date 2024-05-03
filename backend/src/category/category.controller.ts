import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FullCategoriesResponseDto } from './dto/response';

import { CategoryService } from './category.service';
import { OPERATION, RES } from './docs';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(OPERATION.GET_CATEGORIES_TREE)
  @ApiResponse(RES.GET_CATEGORIES_TREE.OK)
  @ApiResponse(RES.GET_CATEGORIES_TREE.INTERNAL_SERVER_ERROR)
  getCategories(): Promise<FullCategoriesResponseDto> {
    return this.categoryService.getCategories();
  }
}
