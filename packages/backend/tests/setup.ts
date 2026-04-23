import { database } from '../src/shared/bootstrap';

afterAll(async () => {
  // Disconnect Prisma so Jest can exit cleanly
  await database.disconnect();
});
