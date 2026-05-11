import { PageObject } from './page-object';
import { PuppeteerPageDriver } from '../driver';
import { CreateUserInput } from '../../../../shared/src/api/user';
import {
  PageElements,
  PageElementsConfig,
} from '../components/component';
import { appSelectors } from '../../../src/shared/selectors';

export class RegistrationPage extends PageObject {
  private elements: PageElements;

  constructor(driver: PuppeteerPageDriver) {
    super(driver, 'http://localhost:5173/join');

    this.elements = new PageElements(
      appSelectors.registration
        .registrationForm as PageElementsConfig,
      driver,
    );
  }

  public async enterAccountDetails(
    input: Partial<CreateUserInput>,
  ): Promise<void> {
    try {
      const fields: Array<[string, string | undefined]> = [
        ['email', input.email],
        ['username', input.username],
        ['firstName', input.firstName],
        ['lastName', input.lastName],
        ['password', input.password],
      ];

      for (const [key, value] of fields) {
        if (value) {
          await this.elements.get(key).fill(value);
        }
      }
    } catch (error) {
      throw new Error(`Failed to enter account details: ${error}`);
    }
  }

  public async acceptMarketingEmails(): Promise<void> {
    const checkbox = this.elements.get('marketingCheckbox');

    const checked = await checkbox
      .map((el: any) => el.checked)
      .wait();

    if (!checked) {
      await checkbox.click();
    }
  }

  public async submitRegistrationForm(): Promise<void> {
    await this.elements.get('submit').click();
  }

  public async getSuccessToastMessage(): Promise<string | null> {
    return await this.elements
      .get('successToast', 5000)
      .map((el) => el.textContent)
      .wait();
  }

  public async getFailureToastMessage(): Promise<string | null> {
    return await this.elements
      .get('failureToast', 5000)
      .map((el) => el.textContent)
      .wait();
  }

  public async isSuccessToastVisible(): Promise<boolean> {
    try {
      await this.elements.get('successToast', 5000).wait();
      return true;
    } catch {
      return false;
    }
  }

  public async isFailureToastVisible(): Promise<boolean> {
    try {
      await this.elements.get('failureToast', 5000).wait();
      return true;
    } catch {
      return false;
    }
  }
}
