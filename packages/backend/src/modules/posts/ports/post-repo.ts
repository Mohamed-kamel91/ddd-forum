import { type Post } from '@dddforum/shared/api/post';
import { getPostsDTO } from '../post-query';

export interface IPostRepo {
  getAll: (dto: getPostsDTO) => Promise<Post[]>;
}
