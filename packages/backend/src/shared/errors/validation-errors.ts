import { BadRequestError } from './http-errors';
import { ErrorTypes } from './error-types';

export class MissingRequestBodyException extends BadRequestError {
  constructor() {
    super('Request body is missing', ErrorTypes.CLIENT_ERROR);
  }
}

export class InvalidRequestBodyException extends BadRequestError {
  constructor(missingKeys: string[]) {
    super(
      'Body is missing required key: ' + missingKeys.join(', '),
      ErrorTypes.VALIDATION_ERROR,
    );
  }
}

export class MissingRequestQueryParamsException extends BadRequestError {
  constructor(missingparams: string[]) {
    super(
      'Query is missing required params: ' +
        missingparams.join(', '),
      ErrorTypes.CLIENT_ERROR,
    );
  }
}

export class InvalidRequestQueryParamsException extends BadRequestError {
  constructor(invalidParams: string[]) {
    super(
      'Query has invalid params: ' + invalidParams.join(', '),
      ErrorTypes.VALIDATION_ERROR,
    );
  }
}


