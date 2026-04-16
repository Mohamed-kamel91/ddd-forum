import { AddEmailToListDTO } from '../dtos/marketing-dtos';
import { ContactListAPI } from './contact-list-api';

class MarketingService {
  constructor(private contactListAPI: ContactListAPI) {}

  public async addEmailToList(dto: AddEmailToListDTO) {
    const result = await this.contactListAPI.addEmailToList(
      dto.email,
    );

    return result;
  }
}

export default MarketingService;
