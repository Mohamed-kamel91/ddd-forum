import { database } from '../../../shared/bootstrap';
import type { IUserRepo } from './user-repo';
import { PrismaUserRepo } from '../adapters/prisma-user-repo';
import type { CreateUserCommand } from '../user-command';
import { CreateUserBuilder } from '../../../../../shared/tests/support/builders';
import { resetDatabase } from '../../../../../shared/tests/support/fixtures';
import { InMemoryUserRepo } from '../adapters/In-memory-user-repo';

describe('User Repository', () => {
  const prisma = database.getConnection();
  const userRepos: IUserRepo[] = [
    new PrismaUserRepo(prisma),
    new InMemoryUserRepo(),
  ];

  beforeAll(async () => {
    await resetDatabase();
  });

  describe.each(userRepos.map((repo) => [repo.constructor.name, repo]))(
    '%s',
    (_, repo) => {
      it('can save a user', async () => {
        const validatedUser = new CreateUserBuilder().build();

        const savedUser = await repo.save(validatedUser as CreateUserCommand);

        expect(savedUser.id).toBeDefined();
        expect(savedUser.email).toBe(validatedUser.email);
        expect(savedUser.username).toBe(validatedUser.username);
        expect(savedUser.firstName).toBe(validatedUser.firstName);
        expect(savedUser.lastName).toBe(validatedUser.lastName);
        expect((savedUser as any).password).toBeUndefined();
      });

      it('can get user by email', async () => {
        const validatedUser = new CreateUserBuilder().build();

        const savedUser = await repo.save(validatedUser as CreateUserCommand);
        const fetchedUser = await repo.getByEmail(validatedUser.email);

        expect(savedUser).toBeDefined();
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.email).toBe(validatedUser.email);
      });

      it('can get a user by username', async () => {
        const validatedUser = new CreateUserBuilder().build();

        const savedUser = await repo.save(validatedUser as CreateUserCommand);
        const fetchedUser = await repo.getByUsername(validatedUser.username);

        expect(savedUser).toBeDefined();
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.username).toBe(validatedUser.username);
      });
    },
  );
});
