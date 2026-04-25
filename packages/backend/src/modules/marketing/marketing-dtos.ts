import {
  MissingRequestBodyException,
  InvalidRequestBodyException,
} from '../../shared/errors';
import { getMissingKeys, isObject } from '../../shared/utils';

export class AddEmailToListDTO {
  private constructor(public email: string) {}

  static fromRequest(body: unknown) {
    if (!isObject<{ email: string }>(body)) {
      throw new MissingRequestBodyException();
    }

    const requiredKeys = ['email'];
    const missingKeys = getMissingKeys(body, requiredKeys);

    if (missingKeys.length > 0) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    return new AddEmailToListDTO(body.email);
  }
}
