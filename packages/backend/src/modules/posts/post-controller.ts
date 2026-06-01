import express from 'express';

import type { GetPostsResponse } from '@dddforum/shared/api/post';

import type { PostService } from './post-service';
import { getPostsQuery } from './post-query';

export class PostController {
  constructor(private postService: PostService) {}

  public getPosts = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const query = getPostsQuery.fromRequest(req.query);
      const posts = await this.postService.getPosts(query);
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
