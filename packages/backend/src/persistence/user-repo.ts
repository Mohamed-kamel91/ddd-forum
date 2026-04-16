import { CreateUserInput } from '@dddforum/shared';
import {
  PrismaClient,
  Member,
  User,
} from '../generated/prisma/client';

export interface IUserRepo {
  save(
    user: CreateUserInput,
  ): Promise<{ user: User; member: Member }>;
  getByEmail(email: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
}

export class UserRepo implements IUserRepo {
  constructor(private prisma: PrismaClient) {}

  public async save(userData: CreateUserInput) {
    const data = await this.prisma.$transaction(async () => {
      const user = await this.prisma.user.create({
        data: { ...userData },
      });

      const member = await this.prisma.member.create({
        data: { userId: user.id },
      });

      return { user, member };
    });

    return data;
  }

  public async getByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    return user;
  }

  public async getByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    return user;
  }
}
