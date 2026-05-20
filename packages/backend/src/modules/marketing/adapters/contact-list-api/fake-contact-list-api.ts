import type { EmailSubscription } from '@dddforum/shared/api/marketing';
import type { IContactListAPI } from '../../ports/contact-list-api';

export class FakeContactListAPI implements IContactListAPI {
  async addEmailToList(email: string): Promise<EmailSubscription> {
    console.log(
      `FakeContactListAPI: Adding ${email} list... for unit testing usage.`,
    );

    return { email, subscribed: true };
  }
}
