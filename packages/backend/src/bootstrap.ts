import { prisma } from './database';
import Application from './app';

import { PostRepo, UserRepo } from './persistence';
import {
  UserService,
  PostService,
  MarketingService,
} from './services';
import { ContactListAPI } from './services/contact-list-api';
import {
  UserController,
  PostController,
  MarketingController,
} from './controllers';
import { UserRouter, PostRouter, MarketingRouter } from './routers';

import { errorHandler } from './shared/errors';

// user
const userRepo = new UserRepo(prisma);
const userService = new UserService(userRepo);
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);

// post
const postRepo = new PostRepo(prisma);
const postService = new PostService(postRepo);
const postController = new PostController(postService);
const postRouter = new PostRouter(postController);

// marketing
const contactListAPI = new ContactListAPI();
const marketingService = new MarketingService(contactListAPI);
const marketingController = new MarketingController(marketingService);
const marketingRouter = new MarketingRouter(marketingController);

const routers = [userRouter, postRouter, marketingRouter];
const app = new Application(routers, errorHandler);

export default app;
