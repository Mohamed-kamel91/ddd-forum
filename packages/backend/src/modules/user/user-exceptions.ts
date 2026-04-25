import {
  NotFoundError,
  BadRequestError,
  ConflictError,
  ExceptionTypes,
} from '../../shared/errors';

export class UserNotFoundException extends NotFoundError {
  constructor() {
    super('User not found', ExceptionTypes.USER_NOT_FOUND);
  }
}

export class EmailAlreadyTakenException extends ConflictError {
  constructor() {
    super(
      'Email is already taken',
      ExceptionTypes.EMAIL_ALREADY_TAKEN,
    );
  }
}

export class UsernameAlreadyTakenException extends ConflictError {
  constructor() {
    super(
      'Username is already taken',
      ExceptionTypes.USERNAME_ALREADY_TAKEN,
    );
  }
}

export class InvalidUserIdException extends BadRequestError {
  constructor() {
    super('User ID is invalid', ExceptionTypes.INVALID_USER_ID);
  }
}

export class MissingUserIdException extends BadRequestError {
  constructor() {
    super('User ID is missing', ExceptionTypes.MISSING_USER_ID);
  }
}
