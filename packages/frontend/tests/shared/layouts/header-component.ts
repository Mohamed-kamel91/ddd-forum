import { appSelectors } from '../../../src/shared/selectors';
import { PuppeteerPageDriver } from '../driver';
import {
  PageElements,
  PageElementsConfig,
} from '../components/component';

export class HeaderComponent {
  private elements: PageElements;

  constructor(private driver: PuppeteerPageDriver) {
    this.elements = new PageElements(
      appSelectors.header as PageElementsConfig,
      this.driver,
    );
  }

  public async getLoggedInUsername(): Promise<string | null> {
    return this.elements
      .get('username')
      .map((el: any) => el.textContent)
      .wait();
  }
}
