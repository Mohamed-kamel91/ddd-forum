import { Config } from '../config';
import { WebServer } from '../http';
import { Database, prisma } from '../database';

import {
  ContactListAPI,
  MarketingService,
  MarketingController,
  MarketingRouter,
} from '../../modules/marketing';

import {
  PostRepo,
  PostService,
  PostController,
  PostRouter,
} from '../../modules/post';

import {
  UserRepo,
  UserService,
  UserController,
  UserRouter,
} from '../../modules/user';

import { ErrorHandler, errorHandler } from '../errors';
import { BaseRouter } from '../http/base-router';

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private config: Config;
  private database: Database;
  private errorHandler: ErrorHandler;

  private userRepo: UserRepo;
  private userService: UserService;
  private userController: UserController;
  private postRepo: PostRepo;
  private postService: PostService;
  private postController: PostController;
  private contactListAPI: ContactListAPI;
  private marketingService: MarketingService;
  private marketingController: MarketingController;

  private routers: BaseRouter[];
  private webServer: WebServer;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }

    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.database = this.createDatabase();
    this.errorHandler = errorHandler;

    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();

    this.postRepo = this.createPostRepo();
    this.postService = this.createPostService();
    this.postController = this.createPostController();

    this.contactListAPI = this.createContactListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();

    this.routers = this.createRouters();
    this.webServer = this.createWebServer();
  }

  public getWebServer() {
    return this.webServer;
  }

  public getDatabase() {
    if (!this.database) {
      this.database = this.createDatabase();
    }

    return this.database;
  }

  private createWebServer() {
    const config = { port: 3000, env: this.config.env };
    return new WebServer(config, this.routers, this.errorHandler);
  }

  private createDatabase() {
    return new Database(prisma);
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

  private createContactListAPI() {
    return new ContactListAPI();
  }

  private createMarketingService() {
    const contactListAPI = this.contactListAPI;
    return new MarketingService(contactListAPI);
  }

  private createMarketingController() {
    const marketingService = this.marketingService;
    return new MarketingController(marketingService);
  }

  private createRouters() {
    const userController = this.userController;
    const userRouter = new UserRouter(userController);

    const postController = this.postController;
    const postRouter = new PostRouter(postController);

    const marketingController = this.marketingController;
    const marketingRouter = new MarketingRouter(marketingController);

    return [userRouter, postRouter, marketingRouter];
  }
}
