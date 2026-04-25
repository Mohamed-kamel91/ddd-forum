import { MarketingController } from './marketing-controller';
import { BaseRouter } from '../../shared/http/base-router';

export class MarketingRouter extends BaseRouter {
  public readonly basePath: string = '/marketing';

  constructor(private controller: MarketingController) {
    super();
  }

  protected setupRoutes(): void {
    this.router.post('/', this.controller.addEmailToList);
  }
}
