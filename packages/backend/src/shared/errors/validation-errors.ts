import { BadRequestError } from './http-errors';
import { GenericErrors } from '@dddforum/shared/errors/generic';

export class MissingRequestBodyException extends BadRequestError {
  constructor() {
    super('Request body is missing', GenericErrors.CLIENT_ERROR);
  }
}

export class InvalidRequestBodyException extends BadRequestError {
  constructor(missingKeys: string[]) {
    super(
      'Body is missing required key: ' + missingKeys.join(', '),
      GenericErrors.VALIDATION_ERROR,
    );
  }
}

export class MissingRequestQueryParamsException extends BadRequestError {
  constructor(missingparams: string[]) {
    super(
      'Query is missing required params: ' + missingparams.join(', '),
      GenericErrors.CLIENT_ERROR,
    );
  }
}

export class InvalidRequestQueryParamsException extends BadRequestError {
  constructor(invalidParams: string[]) {
    super(
      'Query has invalid params: ' + invalidParams.join(', '),
      GenericErrors.VALIDATION_ERROR,
    );
  }
}

export class InvalidInputException extends BadRequestError {
  constructor(fields: string[]) {
    super(
      'Invalid input: ' + fields.join(', '),
      GenericErrors.VALIDATION_ERROR,
    );
  }
}
