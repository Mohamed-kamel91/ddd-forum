import { Request } from 'express';

import {
  InvalidRequestQueryParamsException,
  MissingRequestQueryParamsException,
} from '../shared/errors/validation-errors';

export class getPostsDTO {
  private constructor(public sort: string) {}

  static fromRequest(query: Request['query']) {
    const { sort } = query;

    if (!sort) {
      throw new MissingRequestQueryParamsException(['sort']);
    }

    if (sort !== 'recent') {
      throw new InvalidRequestQueryParamsException(['sort']);
    }

    return new getPostsDTO(sort);
  }
}
