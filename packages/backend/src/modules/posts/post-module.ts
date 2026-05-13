import { Database } from '../../shared/database';
import { WebServer } from '../../shared/http';
import { PostController } from './post-controller';
import { PostRepo } from './post-repo';
import { PostRouter } from './post-router';
import { PostService } from './post-service';

export class PostModule {
  private postRepo: PostRepo;
  private postService: PostService;
  private postController: PostController;
  private postRouter: PostRouter;

  private constructor(private database: Database) {
    this.postRepo = this.createPostRepo();
    this.postService = this.createPostService();
    this.postController = this.createPostController();
    this.postRouter = this.createPostRouter();

    this.setupRoutes();
  }

  static build(database: Database) {
    return new PostModule(database);
  }

  public getRouter() {
    return this.postRouter.getRouter();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.postRouter.basePath;
    const router = this.postRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  private setupRoutes() {
    this.postRouter.register();
  }

  private createPostRepo() {
    const prisma = this.database.getConnection();
    return new PostRepo(prisma);
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
