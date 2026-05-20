import type { EmailSubscription } from '@dddforum/shared/api/marketing';

import type { IContactListAPI } from './ports/contact-list-api';
import type { AddEmailToListCommand } from './marketing-command';

export class MarketingService {
  constructor(private contactListAPI: IContactListAPI) {}

  public async addEmailToList(
    command: AddEmailToListCommand,
  ): Promise<EmailSubscription> {
    const result = await this.contactListAPI.addEmailToList(
      command.email,
    );

    return result;
  }
}
