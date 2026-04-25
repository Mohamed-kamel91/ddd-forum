import { UserController } from './user-controller';
import { BaseRouter } from '../../shared/http/base-router';

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
