import { Config } from '../config';
import { WebServer } from '../http';
import { Database } from '../database';

import { MarketingModule } from '../../modules/marketing';
import { PostModule } from '../../modules/posts';
import { UserModule } from '../../modules/users';

import { errorHandler } from '../errors';
import { NotificationsModule } from '../../modules/notifications/notification-module';
import { Application } from '../application';

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private config: Config;
  private database: Database;
  private webServer: WebServer;

  private notificationsModule: NotificationsModule;
  private marketingModule: MarketingModule;
  private usersModule: UserModule;
  private postsModule: PostModule;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }

    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.database = this.createDatabase();
    this.webServer = this.createWebServer();

    this.notificationsModule = this.createNotificationsModule();
    this.marketingModule = this.createMarektingModule();
    this.usersModule = this.createUsersModule();
    this.postsModule = this.createPostsModule();

    this.mountRoutes();
    this.useErrorHandler();
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

  public getApplication(): Application {
    return {
      user: this.usersModule.getUserService(),
      post: this.postsModule.getPostService(),
      marketing: this.marketingModule.getMarketingService(),
    };
  }

  public getRepositories() {
    return {
      user: this.usersModule.getUserRepo(),
      post: this.postsModule.getPostRepo(),
    };
  }

  private createWebServer() {
    const config = { port: 3000, env: this.config.getEnvironment() };
    return new WebServer(config);
  }

  private createDatabase() {
    return new Database();
  }

  private createUsersModule() {
    const emailAPi =
      this.notificationsModule.getTransactionalEmailAPI();
    return UserModule.build(this.database, emailAPi, this.config);
  }

  private createPostsModule() {
    return PostModule.build(this.database, this.config);
  }

  private createMarektingModule() {
    return MarketingModule.build(this.config);
  }

  private createNotificationsModule() {
    return NotificationsModule.build(this.config);
  }

  private mountRoutes() {
    this.usersModule.mountRouter(this.webServer);
    this.postsModule.mountRouter(this.webServer);
    this.marketingModule.mountRouter(this.webServer);
  }

  private useErrorHandler() {
    this.webServer.useErrorHandler(errorHandler);
  }
}
