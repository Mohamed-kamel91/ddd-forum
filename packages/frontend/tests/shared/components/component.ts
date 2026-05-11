import { PuppeteerPageDriver } from '../driver';

type ElementType = keyof JSX.IntrinsicElements;

export type PageElementsSelector = {
  selector: string;
  type: ElementType;
};

export type PageElementsConfig = {
  [key: string]: PageElementsSelector;
};

export class PageElements {
  constructor(
    private config: PageElementsConfig,
    private driver: PuppeteerPageDriver,
  ) {}

  public get(name: string, timeout?: number) {
    const element = this.config[name];

    if (!element) {
      throw new Error(
        `Element "${name}" not found in config. Available keys: [${Object.keys(
          this.config,
        ).join(', ')}]`,
      );
    }

    const locator = this.driver.page.locator(element.selector);

    return timeout !== undefined
      ? locator.setTimeout(timeout)
      : locator;
  }
}
