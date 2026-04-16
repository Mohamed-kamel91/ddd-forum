import express from 'express';

import { PostService } from '../services';
import { getPostsDTO } from '../dtos/post-dtos';

class PostController {
  constructor(private postService: PostService) {}

  public getPosts = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const dto = getPostsDTO.fromRequest(req.query);
      const posts = await this.postService.getPosts(dto);

      return res.json({
        error: undefined,
        data: { posts },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
