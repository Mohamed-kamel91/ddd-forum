import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './src/shared/database/prisma/schema.prisma',
  migrations: {
    path: './src/shared/database/prisma/migrations',
    seed: 'tsx ./src/shared/database/prisma/seed',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
