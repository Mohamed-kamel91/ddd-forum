import type { MarketingService } from '../../modules/marketing/marketing-service';
import type { PostService } from '../../modules/posts/post-service';
import type { UserService } from '../../modules/users/user-service';

export interface Application {
  user: UserService;
  post: PostService;
  marketing: MarketingService;
}
