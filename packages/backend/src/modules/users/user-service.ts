import { ITransactionalEmailAPI } from '../notifications/ports/transactional-email-api';
import { type IUserRepo } from './ports/user-repo';
import { CreateUserCommand } from './user-command';
import {
  EmailAlreadyTakenException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from './user-exceptions';

export class UserService {
  constructor(
    private userRepo: IUserRepo,
    private emailAPI: ITransactionalEmailAPI,
  ) {}

  public async createUser(userdata: CreateUserCommand) {
    const existingUserByEmail = await this.userRepo.getByEmail(
      userdata.email,
    );

    if (existingUserByEmail) {
      throw new EmailAlreadyTakenException();
    }

    const existingUserByUsername = await this.userRepo.getByUsername(
      userdata.username,
    );

    if (existingUserByUsername) {
      throw new UsernameAlreadyTakenException();
    }

    const user = await this.userRepo.save(userdata);

    await this.emailAPI.sendMail({
      to: user.email,
      subject: 'Your login details to DDDForum',
      text: `<br>Welcome to DDDForum. You can login with the following details </br>`,
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.getByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
