import { PrismaClient, Post } from '../../generated/prisma/client';

export interface IPostRepo {
  getAll: (sort: string) => Promise<Post[]>;
}

export class PostRepo implements IPostRepo {
  constructor(private prisma: PrismaClient) {}

  public async getAll(sort: string) {
    const posts = await this.prisma.post.findMany({
      include: {
        votes: true, // Include associated votes for each post
        memberPostedBy: {
          include: {
            user: true,
          },
        },
        comments: true,
      },
      orderBy: {
        dateCreated: sort === 'recent' ? 'desc' : 'asc', // Sorts by dateCreated in descending order
      },
    });

    return posts;
  }
}
