export type VoteType = 'Upvote' | 'Downvote';
export type Vote = {
  id: number;
  postId: number;
  memberId: number;
  voteType: VoteType;
};
