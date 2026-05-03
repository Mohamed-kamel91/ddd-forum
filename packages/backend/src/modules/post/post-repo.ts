import { PrismaClient } from '../../generated/prisma/client';
import { Post } from '@dddforum/shared/api/post';

export interface IPostRepo {
  getAll: (sort: string) => Promise<Post[]>;
}

export class PostRepo implements IPostRepo {
  constructor(private prisma: PrismaClient) {}

  public async getAll(sort: string): Promise<Post[]> {
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

    const formattedPosts = posts.map((post) => this.formatPost(post));
    return formattedPosts;
  }

  private formatPost(post: any): Post {
    return {
      id: post.id,
      memberId: post.memberId,
      postType: post.postType,
      title: post.title,
      content: post.content,
      dateCreated: post.dateCreated.toISOString(),
      memberPostedBy: {
        user: {
          id: post.memberPostedBy.id,
          email: post.memberPostedBy.user.email,
          username: post.memberPostedBy.user.username,
          firstName: post.memberPostedBy.user.firstName,
          lastName: post.memberPostedBy.user.lastName,
        },
      },
      votes: post.votes,
      comments: post.comments,
    };
  }
}
