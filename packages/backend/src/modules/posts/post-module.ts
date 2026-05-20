import type { IPostRepo } from './ports/post-repo';
import { PrismaPostRepo } from './adapters/prisma-post-repo';
import { PostService } from './post-service';
import { PostController } from './post-controller';
import { PostRouter } from './post-router';
import { Database } from '../../shared/database';
import { WebServer } from '../../shared/http';
import type { Config } from '../../shared/config';
import { InMemoryPostRepo } from './adapters/in-memory-post-repo';

export class PostModule {
  private postRepo: IPostRepo;
  private postService: PostService;
  private postController: PostController;
  private postRouter: PostRouter;

  private constructor(
    private database: Database,
    private config: Config,
  ) {
    this.postRepo = this.createPostRepo();
    this.postService = this.createPostService();
    this.postController = this.createPostController();
    this.postRouter = this.createPostRouter();

    this.setupRoutes();
  }

  static build(database: Database, config: Config) {
    return new PostModule(database, config);
  }

  public getRouter() {
    return this.postRouter.getRouter();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.postRouter.basePath;
    const router = this.postRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  public getPostController() {
    return this.postController;
  }

  public getPostService() {
    return this.postService;
  }

  public getPostRepo() {
    return this.postRepo;
  }

  private setupRoutes() {
    this.postRouter.register();
  }

  private createPostRepo() {
    if (this.config.getScript() === 'test:unit') {
      return new InMemoryPostRepo();
    }

    const prisma = this.database.getConnection();
    return new PrismaPostRepo(prisma);
  }

  private createPostService() {
    const postRepo = this.postRepo;
    return new PostService(postRepo);
  }

  private createPostController() {
    const postService = this.postService;
    return new PostController(postService);
  }

  private createPostRouter() {
    const postController = this.postController;
    return new PostRouter(postController);
  }
}
