import { WebServer } from '../../shared/http';
import { ContactListAPI } from './contact-list-api';
import { MarketingController } from './marketing-controller';
import { MarketingRouter } from './marketing-router';
import { MarketingService } from './marketing-service';

export class MarketingModule {
  private contactListAPI: ContactListAPI;
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private marketingRouter: MarketingRouter;

  private constructor() {
    this.contactListAPI = this.createContactListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
    this.marketingRouter = this.createMarketingRouter();

    this.setupRoutes();
  }

  static build() {
    return new MarketingModule();
  }

  public getRouter() {
    return this.marketingRouter.getRouter();
  }

  public mountRouter(webServer: WebServer) {
    const path = this.marketingRouter.basePath;
    const router = this.marketingRouter.getRouter();
    webServer.mountRouter(path, router);
  }

  private setupRoutes() {
    this.marketingRouter.register();
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

  private createMarketingRouter() {
    const marketingController = this.marketingController;
    return new MarketingRouter(marketingController);
  }
}
