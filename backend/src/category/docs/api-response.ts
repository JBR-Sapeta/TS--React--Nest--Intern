import { INTERNAL_SERVER_ERROR } from '../../common/docs';
import { CategoriesDto } from '../dto/response';

export const RES = {
  GET_CATEGORIES_TREE: {
    OK: {
      status: 200,
      description: 'Success',
      type: CategoriesDto,
    },
    INTERNAL_SERVER_ERROR,
  },
};
