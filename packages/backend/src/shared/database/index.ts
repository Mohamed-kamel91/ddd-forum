import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

class Database {
  constructor(private prisma: PrismaClient) {}

  public getConnection() {
    return this.prisma;
  }

  public async connect() {
    await this.prisma.$connect();
  }

  public async disconnect() {
    await this.prisma.$disconnect();
  }
}

export { prisma, Database };
