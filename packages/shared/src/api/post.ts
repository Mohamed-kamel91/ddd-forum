import axios from 'axios';

import { APIResponse, GenericErrors } from '.';
import { Comment } from './comment';
import { User } from './user';
import { Vote } from './vote';

export type GetPostsSortOption = 'recent';

export type GetPostParams = {
  sort: GetPostsSortOption;
};

export type Post = {
  id: number;
  memberId: number;
  postType: string;
  title: string;
  content: string;
  dateCreated: string;
  memberPostedBy: {
    user: User;
  };
  votes: Vote[];
  comments: Comment[];
};

export type GetPostsResponsedata = { posts: Post[] };
export type GetPostsError = GenericErrors;
export type GetPostsResponse = APIResponse<
  GetPostsResponsedata,
  GetPostsError
>;

export const createPostAPI = (apiURL: string) => {
  return {
    getPosts: async ({
      sort,
    }: GetPostParams): Promise<GetPostsResponse> => {
      try {
        const response = await axios.get(`${apiURL}/posts`, {
          params: { sort },
        });

        return response.data as GetPostsResponse;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return err.response?.data as GetPostsResponse;
        }

        throw err;
      }
    },
  };
};
