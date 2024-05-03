import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { FullCategoriesResponseDto } from './dto/response';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async getCategories(): Promise<FullCategoriesResponseDto> {
    const categories = await this.categoryRepository.getCategoriesTree();

    return new FullCategoriesResponseDto({}, categories);
  }
}
