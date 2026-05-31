import { Spy } from '../../../../shared/test-doubles/spy';
import type {
  ITransactionalEmailAPI,
  SendMailInput,
} from '../../ports/transactional-email-api';

export class FakeTransactionalEmailAPI
  extends Spy<ITransactionalEmailAPI>
  implements ITransactionalEmailAPI
{
  constructor() {
    super();
  }

  public async sendMail(input: SendMailInput): Promise<boolean> {
    this.addCall('sendMail', [input]);
    return true;
  }
}
