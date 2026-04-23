import { ContactListAPI } from '.';
import { AddEmailToListDTO } from '../dtos/marketing-dtos';

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
