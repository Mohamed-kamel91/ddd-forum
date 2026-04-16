import { type IUserRepo } from '../persistence';
import { CreateUserDTO } from '../dtos/user-dtos';
import {
  EmailAlreadyTakenException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from '../exceptions/user-exceptions';

class UserService {
  constructor(private userRepo: IUserRepo) {}

  public async createUser(dto: CreateUserDTO) {
    const existingUserByEmail = await this.userRepo.getByEmail(
      dto.email,
    );

    if (existingUserByEmail) {
      throw new EmailAlreadyTakenException();
    }

    const existingUserByUsername = await this.userRepo.getByUsername(
      dto.username,
    );

    if (existingUserByUsername) {
      throw new UsernameAlreadyTakenException();
    }

    const user = await this.userRepo.save(dto);

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

export default UserService;
