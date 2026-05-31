import type { EmailSubscription } from '@dddforum/shared/api/marketing';
import { Spy } from '../../../../shared/test-doubles/spy';
import type { IContactListAPI } from '../../ports/contact-list-api';

export class FakeContactListAPI
  extends Spy<IContactListAPI>
  implements IContactListAPI
{
  constructor() {
    super();
  }

  async addEmailToList(email: string): Promise<EmailSubscription> {
    console.log(
      `FakeContactListAPI: Adding ${email} list... for unit testing usage.`,
    );

    this.addCall('addEmailToList', [email]);
    return { email, subscribed: true };
  }
}
