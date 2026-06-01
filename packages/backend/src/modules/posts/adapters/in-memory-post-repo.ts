import type { Post } from '@dddforum/shared/api/post';

import type { IPostRepo } from '../ports/post-repo';
import type { getPostsQuery } from '../post-query';

export class InMemoryPostRepo implements IPostRepo {
  private posts: Post[];

  constructor() {
    this.posts = [];
  }

  public getAll(_: getPostsQuery): Promise<Post[]> {
    return Promise.resolve(this.posts);
  }
}
