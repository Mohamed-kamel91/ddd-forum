import { faker } from '@faker-js/faker';
import { CreateUserInput } from '../../../src/api/user';

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

  public withPasswrod(password: string) {
    this.props.password = password;
    return this;
  }

  public build() {
    return this.props;
  }
}
