import { PrismaClient, Member } from '../../generated/prisma/client';
import { CreateUserDTO } from './user-dtos';

import { User } from '@dddforum/shared/api/user';

export interface IUserRepo {
  save(user: CreateUserDTO): Promise<{ user: User; member: Member }>;
  getByEmail(email: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
}

export class UserRepo implements IUserRepo {
  constructor(private prisma: PrismaClient) {}

  public async save(user: CreateUserDTO) {
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

      const member = await this.prisma.member.create({
        data: { userId: user.id },
      });

      return { user, member };
    });

    const formattedUser = this.formatUser(result.user);
    const data = {
      user: formattedUser,
      member: result.member,
    };

    return data;
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
