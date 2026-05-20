import type { ITransactionalEmailAPI } from '../../ports/transactional-email-api';

export class MailJetEmailAPI implements ITransactionalEmailAPI {
  async sendMail(input: {
    to: string;
    subject: string;
    text: string;
  }) {
    console.log(
      `Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );

    return true;
  }
}
