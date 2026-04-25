import { getMissingKeys, isObject } from '../../shared/utils';
import {
  InvalidRequestBodyException,
  MissingRequestBodyException,
} from '../../shared/errors';
import { CreateUserInput } from '@dddforum/shared';

export class CreateUserDTO {
  private constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public username: string,
    public password: string,
  ) {}

  static fromRequest(body: unknown) {
    if (!isObject<CreateUserInput>(body)) {
      throw new MissingRequestBodyException();
    }

    const requiredKeys = [
      'email',
      'firstName',
      'lastName',
      'username',
      'password',
    ];

    const missingKeys = getMissingKeys(body, requiredKeys);

    if (missingKeys.length > 0) {
      throw new InvalidRequestBodyException(missingKeys);
    }

    const { email, firstName, lastName, username, password } = body;

    return new CreateUserDTO(
      email,
      firstName,
      lastName,
      username,
      password,
    );
  }
}
