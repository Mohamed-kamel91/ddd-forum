import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';

export class PuppeteerPageDriver {
  private constructor(
    public browser: Browser,
    public page: Page,
  ) {}

  static async create(options?: LaunchOptions) {
    const defaultOptions = {
      headless: false,
      slowMo: 0,
    };

    const browser = await puppeteer.launch(options || defaultOptions);
    const page = await browser.newPage();

    return new PuppeteerPageDriver(browser, page);
  }
}
