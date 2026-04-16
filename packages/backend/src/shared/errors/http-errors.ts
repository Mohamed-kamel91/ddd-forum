export class HttpError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends HttpError {
  constructor(
    message: string = 'Resource not found',
    code: string = 'NOT_FOUND',
  ) {
    super(message, 404, code);
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message: string = 'Bad request',
    code: string = 'BAD_REQUEST',
  ) {
    super(message, 400, code);
  }
}

export class ConflictError extends HttpError {
  constructor(
    message: string = 'Conflit',
    code: string = 'CONFLICT',
  ) {
    super(message, 409, code);
  }
}

export class InternalServerError extends HttpError {
  constructor(
    message: string = 'Something went wrong on our end',
    code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message, 500, code);
  }
}
