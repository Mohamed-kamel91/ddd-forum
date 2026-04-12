import { faker } from '@faker-js/faker';

import { prisma } from '../../src/database';
import { CreateUserInput } from '../../../shared/src';

export class UserBuilder {
  private user: CreateUserInput = {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  };

  public withEmail(email: string) {
    this.user.email = email;
    return this;
  }

  public withFirstname(firstname: string) {
    this.user.firstName = firstname;
    return this;
  }

  public withLastname(lastname: string) {
    this.user.lastName = lastname;
    return this;
  }

  public withUsername(username: string) {
    this.user.username = username;
    return this;
  }

  public async build() {
    const { email, firstName, lastName, username, password } =
      this.user;

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        username,
        password,
      },
    });

    return user;
  }
}

export async function buildManyUsers(
  users: Partial<CreateUserInput>[],
) {
  return prisma.$transaction(
    users.map((user) =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.username(),
          password: faker.internet.password(),
          ...user,
        },
      }),
    ),
  );
}
