import { BaseRouter } from '../base-router';
import { UserController } from '../controllers';

export class UserRouter extends BaseRouter {
  public readonly basePath: string = '/users';

  constructor(private controller: UserController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.post('/', this.controller.createUser);
    this.router.get('/', this.controller.getUserByEmail);
  }
}
