import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repository';
import { FullCategoriesResponseDto } from './dto/response';
import { Nullable } from '../common/types';
import { CategoryEntity } from '../entity';
import { CacheService } from '../cache/cache.service';
import { isNil } from 'ramda';

@Injectable()
export class CategoryService {
  private cacheKey = 'categories';
  private cacheExpirationTime = 3600;

  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async getCategories(): Promise<FullCategoriesResponseDto> {
    let cachedCategories: Nullable<CategoryEntity[]> = null;
    let categories: Nullable<CategoryEntity[]> = [];

    cachedCategories = await this.cacheService.getData<CategoryEntity[]>(
      this.cacheKey,
    );

    if (isNil(cachedCategories)) {
      categories = await this.categoryRepository.getCategoriesTree();

      await this.cacheService.setData(
        this.cacheKey,
        categories,
        this.cacheExpirationTime,
      );
    }

    return new FullCategoriesResponseDto({}, cachedCategories || categories);
  }
}
