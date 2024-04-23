import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { CategoriesDto } from './dto/response';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async getCategories(): Promise<CategoriesDto> {
    const categories = await this.categoryRepository.getCategoriesTree();

    return new CategoriesDto({}, categories);
  }
}
