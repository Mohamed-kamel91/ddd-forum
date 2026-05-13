import express from 'express';

import { PostService } from './post-service';
import { getPostsDTO } from './post-dtos';

import { GetPostsResponse } from '@dddforum/shared/api/post';

export class PostController {
  constructor(private postService: PostService) {}

  public getPosts = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const dto = getPostsDTO.fromRequest(req.query);
      const posts = await this.postService.getPosts(dto);
      const response: GetPostsResponse = {
        error: null,
        data: { posts },
        success: true,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
