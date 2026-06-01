import type { User } from '@dddforum/shared/api/user';

import type { IUserRepo } from '../ports/user-repo';
import type { CreateUserCommand } from '../user-command';
import type { PrismaClient } from '../../../shared/database/prisma/generated/client';

export class PrismaUserRepo implements IUserRepo {
  constructor(private prisma: PrismaClient) {}

  public async save(user: CreateUserCommand): Promise<User> {
    const { email, firstName, lastName, username, password } = user;

    const result = await this.prisma.$transaction(async () => {
      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          username,
          password,
        },
      });

      await this.prisma.member.create({
        data: { userId: user.id },
      });

      return user;
    });

    const formattedUser = this.formatUser(result);

    return formattedUser;
  }

  public async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      return this.formatUser(user);
    }

    return user;
  }

  public async getByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (user) {
      return this.formatUser(user);
    }

    return user;
  }

  private formatUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };
  }
}
