import type { Post } from '@dddforum/shared/api/post';
import type { getPostsQuery } from '../post-query';

export interface IPostRepo {
  getAll: (dto: getPostsQuery) => Promise<Post[]>;
}
