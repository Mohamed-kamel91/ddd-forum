import type { CreateUserInput } from '@dddforum/shared/api/user';

import {
  getMissingKeys,
  isBetweenLength,
  isObject,
} from '../../shared/utils';
import {
  InvalidInputException,
  InvalidRequestBodyException,
  MissingRequestBodyException,
} from '../../shared/errors/validation-errors';

export class CreateUserCommand {
  private constructor(public props: CreateUserInput) {}

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

    return CreateUserCommand.fromProps(body);
  }

  static fromProps(props: CreateUserInput) {
    const validations = {
      email: props.email.includes('@'),
      firstName: isBetweenLength(props.firstName, 2, 16),
      lastName: isBetweenLength(props.lastName, 2, 25),
      username: isBetweenLength(props.username, 2, 25),
    };

    const invalidFields = Object.entries(validations)
      .filter(([, isValid]) => !isValid)
      .map(([field]) => field);

    if (invalidFields.length > 0) {
      throw new InvalidInputException(invalidFields);
    }

    return new CreateUserCommand(props);
  }

  get email() {
    return this.props.email;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }
}
