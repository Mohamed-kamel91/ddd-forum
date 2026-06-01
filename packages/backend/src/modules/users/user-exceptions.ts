import { UserErrors } from '@dddforum/shared/errors/user';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../../shared/errors';

export class UserNotFoundException extends NotFoundError {
  constructor() {
    super('User not found', UserErrors.USER_NOT_FOUND);
  }
}

export class EmailAlreadyTakenException extends ConflictError {
  constructor() {
    super('Email is already taken', UserErrors.EMAIL_ALREADY_TAKEN);
  }
}

export class UsernameAlreadyTakenException extends ConflictError {
  constructor() {
    super(
      'Username is already taken',
      UserErrors.USERNAME_ALREADY_TAKEN,
    );
  }
}

export class InvalidUserIdException extends BadRequestError {
  constructor() {
    super('User ID is invalid', UserErrors.INVALID_USER_ID);
  }
}

export class MissingUserIdException extends BadRequestError {
  constructor() {
    super('User ID is missing', UserErrors.MISSING_USER_ID);
  }
}
