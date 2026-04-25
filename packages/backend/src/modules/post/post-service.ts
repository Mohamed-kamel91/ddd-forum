import { getPostsDTO } from './post-dtos';
import { type IPostRepo } from './post-repo';

export class PostService {
  constructor(private postRepo: IPostRepo) {}

  public async getPosts(dto: getPostsDTO) {
    const posts = await this.postRepo.getAll(dto.sort);

    return posts;
  }
}
