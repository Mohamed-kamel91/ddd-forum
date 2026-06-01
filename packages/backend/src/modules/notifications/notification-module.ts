import type { ITransactionalEmailAPI } from './ports/transactional-email-api';
import type { Config } from '../../shared/config';
import { FakeTransactionalEmailAPI } from './adapters/transactional-email-api/fake-transactional-email-api';
import { MailJetEmailAPI } from './adapters/transactional-email-api/mail-jet-email-api';

export class NotificationsModule {
  private transactionalEmailAPI: ITransactionalEmailAPI;

  private constructor(private config: Config) {
    this.transactionalEmailAPI = this.createTransactionalEmailAPI();
  }

  static build(config: Config) {
    return new NotificationsModule(config);
  }

  public getTransactionalEmailAPI() {
    return this.transactionalEmailAPI;
  }

  private createTransactionalEmailAPI() {
    if (this.config.getScript() === 'test:unit') {
      return new FakeTransactionalEmailAPI();
    }

    return new MailJetEmailAPI();
  }
}
