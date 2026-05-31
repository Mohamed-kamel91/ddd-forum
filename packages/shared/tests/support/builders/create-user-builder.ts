import { faker } from '@faker-js/faker';

import type { CreateUserInput } from '../../../src/api/user';
import { CreateUserCommand } from '../../../../backend/src/modules/users/user-command';

export class CreateUserBuilder {
  private props: CreateUserInput;

  constructor() {
    this.props = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      password: faker.internet.password(),
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

  public withPasswrod(password: string) {
    this.props.password = password;
    return this;
  }

  public build() {
    return this.props;
  }

  public buildCommand() {
    return CreateUserCommand.fromProps(this.props);
  }
}
