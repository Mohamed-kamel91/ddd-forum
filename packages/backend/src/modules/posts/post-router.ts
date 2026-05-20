import { BaseRouter } from '../../shared/http/base-router';
import type { PostController } from './post-controller';

export class PostRouter extends BaseRouter {
  public readonly basePath: string = '/posts';

  constructor(private controller: PostController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.get('/', this.controller.getPosts);
  }
}
