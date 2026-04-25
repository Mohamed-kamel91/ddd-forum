export class ContactListAPI {
  async addEmailToList(
    email: string,
  ): Promise<{ email: string; subscribed: boolean }> {
    // Do the actual work
    console.log(
      `MailchimpContactList: Adding ${email} list... for production usage.`,
    );

    return { email, subscribed: true };
  }
}

