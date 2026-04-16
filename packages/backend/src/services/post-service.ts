import { getPostsDTO } from '../dtos/post-dtos';
import { type IPostRepo } from '../persistence/post-repo';

class PostService {
  constructor(private postRepo: IPostRepo) {}

  public async getPosts(dto: getPostsDTO) {
    const posts = await this.postRepo.getAll(dto.sort);

    return posts;
  }
}

export default PostService;
