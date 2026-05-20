import type { IPostRepo } from './ports/post-repo';
import type { getPostsQuery } from './post-query';

export class PostService {
  constructor(private postRepo: IPostRepo) {}

  public async getPosts(query: getPostsQuery) {
    const posts = await this.postRepo.getAll(query);
    return posts;
  }
}
