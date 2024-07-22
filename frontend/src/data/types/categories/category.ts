import { ResponseWithData } from '../utils/http-response';

export type CategoryResponse = ResponseWithData<Category[]>;
export type Category = {
  id: number;
  name: string;
  parentId: null;
  children: SubCategory[];
};

type SubCategory = {
  id: number;
  name: string;
  parentId: number;
  children: SubCategory[];
};
