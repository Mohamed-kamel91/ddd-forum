import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';

import { HttpError, InternalServerError } from './http-errors';

export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
      },
      success: false,
    });
  }

  console.error('--- UNEXPECTED ERROR ---');
  console.error(err);

  const internalServerError = new InternalServerError();

  return res.status(internalServerError.status).json({
    data: undefined,
    error: internalServerError.code,
    message: internalServerError.message,
    success: false,
  });
};
