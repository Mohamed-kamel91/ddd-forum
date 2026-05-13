import { Database } from '../../shared/database';
import { WebServer } from '../../shared/http';
import { UserController } from './user-controller';
import { UserRepo } from './user-repo';
import { UserRouter } from './user-router';
import { UserService } from './user-service';

export class UserModule {
  private userRepo: UserRepo;
  private userService: UserService;
  private userController: UserController;
  private userRouter: UserRouter;

  private constructor(private database: Database) {
    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();
    this.userRouter = this.createUserRouter();

    this.setupRoutes();
  }

  static build(database: Database) {
    return new UserModule(database);
  }

  public getRouter() {
    return this.userRouter.getRouter();
  }

  private setupRoutes() {
    this.userRouter.register();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.userRouter.basePath;
    const router = this.userRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  private createUserRepo() {
    const prisma = this.database.getConnection();
    return new UserRepo(prisma);
  }

  private createUserService() {
    const userRepo = this.userRepo;
    return new UserService(userRepo);
  }

  private createUserController() {
    const userService = this.userService;
    return new UserController(userService);
  }

  private createUserRouter() {
    const userContoller = this.userController;
    return new UserRouter(userContoller);
  }
}
