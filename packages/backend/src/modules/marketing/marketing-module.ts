import type { IContactListAPI } from './ports/contact-list-api';
import { MailchimpContactList } from './adapters/contact-list-api/mail-chimp-contact-list';
import { MarketingService } from './marketing-service';
import { MarketingController } from './marketing-controller';
import { MarketingRouter } from './marketing-router';
import { WebServer } from '../../shared/http';
import type { Config } from '../../shared/config';
import { FakeContactListAPI } from './adapters/contact-list-api/fake-contact-list-api';

export class MarketingModule {
  private contactListAPI: IContactListAPI;
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private marketingRouter: MarketingRouter;

  private constructor(private config: Config) {
    this.contactListAPI = this.createContactListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
    this.marketingRouter = this.createMarketingRouter();

    this.setupRoutes();
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  public getRouter() {
    return this.marketingRouter.getRouter();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.marketingRouter.basePath;
    const router = this.marketingRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public getMarketingService() {
    return this.marketingService;
  }

  public getContactListAPI() {
    return this.contactListAPI;
  }

  private setupRoutes() {
    this.marketingRouter.register();
  }

  private createContactListAPI() {
    if (this.config.getScript() === 'test:unit') {
      return new FakeContactListAPI();
    }

    return new MailchimpContactList();
  }

  private createMarketingService() {
    const contactListAPI = this.contactListAPI;
    return new MarketingService(contactListAPI);
  }

  private createMarketingController() {
    const marketingService = this.marketingService;
    return new MarketingController(marketingService);
  }

  private createMarketingRouter() {
    const marketingController = this.marketingController;
    return new MarketingRouter(marketingController);
  }
}
