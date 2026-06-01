export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

export interface ITransactionalEmailAPI {
  sendMail(input: SendMailInput): Promise<boolean>;
}
