import { GoToOptions } from 'puppeteer';
import { PuppeteerPageDriver } from '../driver/puppeteer-page-driver';

export abstract class PageObject {
  constructor(
    protected driver: PuppeteerPageDriver,
    public url: string,
  ) {}

  public async open(options?: GoToOptions): Promise<void> {
    await this.driver.page.goto(this.url, options);
  }
}
