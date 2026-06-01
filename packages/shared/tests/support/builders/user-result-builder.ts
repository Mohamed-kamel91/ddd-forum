import { faker } from '@faker-js/faker';

import type { User } from '../../../src/api/user';
import { NumberUtil } from '../../../src/utils/number-utils';

export class UserResultBuilder {
  private props: User;

  constructor() {
    this.props = {
      id: NumberUtil.generateRandomInteger(100000, 8000000),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
    };
  }

  public withEmail(email: string) {
    this.props.email = email;
    return this;
  }

  public withFirstName(firstname: string) {
    this.props.firstName = firstname;
    return this;
  }

  public withLastName(lastname: string) {
    this.props.lastName = lastname;
    return this;
  }

  public withUsername(username: string) {
    this.props.username = username;
    return this;
  }

  public build() {
    return this.props;
  }
}
