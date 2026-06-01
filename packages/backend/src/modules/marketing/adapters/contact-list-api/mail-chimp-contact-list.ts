import type { EmailSubscription } from '@dddforum/shared/api/marketing';
import type { IContactListAPI } from '../../ports/contact-list-api';

export class MailchimpContactList implements IContactListAPI {
  async addEmailToList(email: string): Promise<EmailSubscription> {
    console.log(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );

    return { email, subscribed: true };
  }
}
