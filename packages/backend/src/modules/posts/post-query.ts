import { Request } from 'express';

import type { GetPostParams } from '@dddforum/shared/api/post';
import {
  InvalidRequestQueryParamsException,
  MissingRequestQueryParamsException,
} from '../../shared/errors';

export class getPostsQuery {
  private constructor(public props: GetPostParams) {}

  static fromRequest(query: Request['query']) {
    const { sort } = query;

    if (!sort) {
      throw new MissingRequestQueryParamsException(['sort']);
    }

    if (sort !== 'recent') {
      throw new InvalidRequestQueryParamsException(['sort']);
    }

    return new getPostsQuery({ sort });
  }

  get sort() {
    return this.props.sort;
  }
}
