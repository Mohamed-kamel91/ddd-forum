import { BaseRouter } from '../shared/http/base-router';
import { MarketingController } from '../controllers';

export class MarketingRouter extends BaseRouter {
  public readonly basePath: string = '/marketing';

  constructor(private controller: MarketingController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.post('/', this.controller.addEmailToList);
  }
}
