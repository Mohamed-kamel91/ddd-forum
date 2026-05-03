import { AddEmailToListDTO } from './marketing-dtos';
import { ContactListAPI } from './contact-list-api';

import { EmailSubscription } from '@dddforum/shared/api/marketing';

export class MarketingService {
  constructor(private contactListAPI: ContactListAPI) {}

  public async addEmailToList(
    dto: AddEmailToListDTO,
  ): Promise<EmailSubscription> {
    const result = await this.contactListAPI.addEmailToList(
      dto.email,
    );

    return result;
  }
}
