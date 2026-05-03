import { GenericErrors } from '../errors';
import { createMarketingAPI } from './marketing';
import { createPostAPI } from './post';
import { createUserAPI } from './user';

export type APIError<U> = {
  message: string;
  code: U;
};

export type SuccessResponse<Data> = {
  success: true;
  data: Data;
  error: null;
};

export type FailureResponse<ErrorCode> = {
  success: false;
  data: null;
  error: APIError<ErrorCode>;
};

export type APIResponse<T, U> =
  | SuccessResponse<T>
  | FailureResponse<U>;

export type ServerError = typeof GenericErrors.SERVER_ERROR;
export type ClientError = typeof GenericErrors.CLIENT_ERROR;
export type ValidationError = typeof GenericErrors.VALIDATION_ERROR;

export type GenericErrors =
  | ServerError
  | ClientError
  | ValidationError;

export const createAPIClient = (apiURL: string) => {
  return {
    user: createUserAPI(apiURL),
    marketing: createMarketingAPI(apiURL),
    post: createPostAPI(apiURL),
  };
};
