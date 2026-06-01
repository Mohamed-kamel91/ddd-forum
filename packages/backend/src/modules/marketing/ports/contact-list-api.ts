import type { EmailSubscription } from '@dddforum/shared/api/marketing';

export interface IContactListAPI {
  addEmailToList(email: string): Promise<EmailSubscription>;
}
