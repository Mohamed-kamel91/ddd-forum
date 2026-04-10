import { faker } from '@faker-js/faker';
import { CreateUserParams } from '../../src';

export class CreateUserBuilder {
  private props: CreateUserParams;

  constructor() {
    this.props = {
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

  public withFirstname(firstname: string) {
    this.props.firstName = firstname;
    return this;
  }

  public withLastname(lastname: string) {
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
