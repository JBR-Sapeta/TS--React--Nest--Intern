import { INTERNAL_SERVER_ERROR } from '../../common/docs';
import { FullCategoriesResponseDto } from '../dto/response';

export const RES = {
  GET_CATEGORIES_TREE: {
    OK: {
      status: 200,
      description: 'Success',
      type: FullCategoriesResponseDto,
    },
    INTERNAL_SERVER_ERROR,
  },
};
