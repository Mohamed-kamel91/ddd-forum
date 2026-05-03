import { Config } from '../config';
import { WebServer } from '../http';
import { Database, prisma } from '../database';

import { MarketingModule } from '../../modules/marketing';
import { PostModule } from '../../modules/post';
import { UserModule } from '../../modules/user';

import { errorHandler } from '../errors';

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private config: Config;
  private database: Database;
  private webServer: WebServer;

  private userModule: UserModule;
  private postModule: PostModule;
  private marketingModule: MarketingModule;

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

    this.userModule = this.createUserModule();
    this.postModule = this.createPostModule();
    this.marketingModule = this.createMarektingModule();

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

  private createWebServer() {
    const config = { port: 3000, env: this.config.env };
    return new WebServer(config);
  }

  private createDatabase() {
    return new Database(prisma);
  }

  private createUserModule() {
    return UserModule.build(this.database);
  }

  private createPostModule() {
    return PostModule.build(this.database);
  }

  private createMarektingModule() {
    return MarketingModule.build();
  }

  private mountRoutes() {
    this.userModule.mountRouter(this.webServer);
    this.postModule.mountRouter(this.webServer);
    this.marketingModule.mountRouter(this.webServer);
  }

  private useErrorHandler() {
    this.webServer.useErrorHandler(errorHandler);
  }
}
