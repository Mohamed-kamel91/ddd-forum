import { EmailSubscription } from '@dddforum/shared/api/marketing';

export class ContactListAPI {
  async addEmailToList(email: string): Promise<EmailSubscription> {
    // Do the actual work
    console.log(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );

    return { email, subscribed: true };
  }
}
