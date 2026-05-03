import { Request } from 'express';

import {
  InvalidRequestQueryParamsException,
  MissingRequestQueryParamsException,
} from '../../shared/errors/validation-errors';

import { GetPostParams } from '@dddforum/shared/api/post';

export class getPostsDTO {
  private constructor(public props: GetPostParams) {}

  static fromRequest(query: Request['query']) {
    const { sort } = query;

    if (!sort) {
      throw new MissingRequestQueryParamsException(['sort']);
    }

    if (sort !== 'recent') {
      throw new InvalidRequestQueryParamsException(['sort']);
    }

    return new getPostsDTO({ sort });
  }

  get sort() {
    return this.props.sort;
  }
}
