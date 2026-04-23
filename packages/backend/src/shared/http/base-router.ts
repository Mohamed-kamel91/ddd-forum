import { Router } from 'express';

export abstract class BaseRouter {
  protected router: Router;

  public abstract readonly basePath: string;
  protected abstract setupRoutes(): void;

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    return this.router;
  }

  public register(): void {
    this.setupRoutes();
  }
}
