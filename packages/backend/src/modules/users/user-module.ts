import type { IUserRepo } from './ports/user-repo';
import { PrismaUserRepo } from './adapters/prisma-user-repo';
import { UserService } from './user-service';
import { UserController } from './user-controller';
import { UserRouter } from './user-router';
import { Database } from '../../shared/database';
import { WebServer } from '../../shared/http';
import type { Config } from '../../shared/config';
import type { ITransactionalEmailAPI } from '../notifications/ports/transactional-email-api';
import { InMemoryUserRepo } from './adapters/In-memory-user-repo';

export class UserModule {
  private userRepo: IUserRepo;
  private userService: UserService;
  private userController: UserController;
  private userRouter: UserRouter;

  private constructor(
    private database: Database,
    private emailAPI: ITransactionalEmailAPI,
    private config: Config,
  ) {
    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();
    this.userRouter = this.createUserRouter();

    this.setupRoutes();
  }

  static build(
    database: Database,
    emailAPI: ITransactionalEmailAPI,
    config: Config,
  ) {
    return new UserModule(database, emailAPI, config);
  }

  public getRouter() {
    return this.userRouter.getRouter();
  }

  public getUserController() {
    return this.userController;
  }

  public getUserService() {
    return this.userService;
  }

  public getUserRepo() {
    return this.userRepo;
  }

  private setupRoutes() {
    this.userRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.userRouter.basePath;
    const router = this.userRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  private createUserController() {
    const userService = this.userService;
    return new UserController(userService);
  }

  private createUserService() {
    return new UserService(this.userRepo, this.emailAPI);
  }

  private createUserRepo() {
    if (this.config.getScript() === 'test:unit') {
      return new InMemoryUserRepo();
    }

    const prisma = this.database.getConnection();
    return new PrismaUserRepo(prisma);
  }

  private createUserRouter() {
    const userContoller = this.userController;
    return new UserRouter(userContoller);
  }
}
