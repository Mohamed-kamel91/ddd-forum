import { PuppeteerPageDriver } from '../driver';

export class NotificationsComponent {
  constructor(private driver: PuppeteerPageDriver) {}

  public async isSuccessToastVisible() {}

  public async isFailureToastVisible() {}
}
