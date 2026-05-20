import { database } from '../../../shared/bootstrap';
import { type IPostRepo } from './post-repo';
import { PrismaPostRepo } from '../adapters/prisma-post-repo';
import { type getPostsQuery } from '../post-query';
import { resetDatabase } from '../../../../../shared/tests/support/fixtures';

describe('Post Repository', () => {
  const prisma = database.getConnection();
  const postRepos: IPostRepo[] = [new PrismaPostRepo(prisma)];

  beforeAll(() => {
    database.connect();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  describe.each(
    postRepos.map((repo) => [repo.constructor.name, repo]),
  )('%s', (_, repo) => {
    // it('can get recent posts', async () => {
    //   await new CreateUserBuilder().withPost().build();
    //   await new CreateUserBuilder().withPost().build();

    //   const dto = { sort: 'recent' } as getPostsDTO;

    //   const posts = await repo.getAll(dto);

    //   expect(posts).toHaveLength(2);
    //   expect(posts[0]).toMatchObject({
    //     title: expect.any(String),
    //     // whatever shape IPostRepo.getAll should return
    //   });
    // });

    it('returns empty array when no posts exist', async () => {
      const dto = { sort: 'recent' } as getPostsQuery;
      const posts = await repo.getAll(dto);
      expect(posts).toEqual([]);
    });
  });
});
