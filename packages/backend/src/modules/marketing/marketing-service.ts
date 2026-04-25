import { AddEmailToListDTO } from './marketing-dtos';
import { ContactListAPI } from './contact-list-api';

export class MarketingService {
  constructor(private contactListAPI: ContactListAPI) {}

  public async addEmailToList(dto: AddEmailToListDTO) {
    const result = await this.contactListAPI.addEmailToList(
      dto.email,
    );

    return result;
  }
}
