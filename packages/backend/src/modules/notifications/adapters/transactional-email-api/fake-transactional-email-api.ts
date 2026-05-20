import type {
  ITransactionalEmailAPI,
  SendMailInput,
} from '../../ports/transactional-email-api';

export class FakeTransactionalEmailAPI implements ITransactionalEmailAPI {
  public async sendMail(_: SendMailInput): Promise<boolean> {
    return true;
  }
}
