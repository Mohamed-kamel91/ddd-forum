import type { User } from '@dddforum/shared/api/user';

import type { CreateUserCommand } from '../user-command';
import type { IUserRepo } from '../ports/user-repo';
import { Spy } from '../../../shared/test-doubles/spy';

export class InMemoryUserRepo
  extends Spy<IUserRepo>
  implements IUserRepo
{
  private users: User[];
  private nextId = 1;

  constructor() {
    super();
    this.users = [];
  }

  public save(user: CreateUserCommand): Promise<User> {
    const { email, firstName, lastName, username, password } = user;

    this.addCall('save', [user]);

    const newUser = {
      id: this.nextId++,
      email,
      firstName,
      lastName,
      username,
      password,
    };

    this.users.push(newUser);

    const { password: _, ...safeUser } = newUser;

    return Promise.resolve({ ...safeUser });
  }

  public getById(id: number): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.id === id) || null,
    );
  }

  public delete(email: string): Promise<void> {
    const index = this.users.findIndex(
      (user) => user.email === email,
    );

    if (index !== -1) {
      this.users.splice(index, 1);
    }

    return Promise.resolve();
  }

  public update(
    id: number,
    props: Partial<CreateUserCommand['props']>,
  ): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const existingUser = this.users[userIndex]!;

      this.users[userIndex] = {
        ...existingUser,
        ...props,
      };

      return Promise.resolve(this.users[userIndex]);
    }

    return Promise.resolve(null);
  }

  public getByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.email === email) || null,
    );
  }

  public getByUsername(username: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.username === username) || null,
    );
  }

  public async reset() {
    this.users = [];
    this.calls = [];
  }
}
