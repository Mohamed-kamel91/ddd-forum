import axios from 'axios';

import { APIResponse, GenericErrors, ServerError } from '.';
import { UserErrors } from '../errors';

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

export type EmailAlreadyTaken = typeof UserErrors.EMAIL_ALREADY_TAKEN;
export type UsernameAlreadyTaken =
  typeof UserErrors.USERNAME_ALREADY_TAKEN;
export type CreateUserError =
  | GenericErrors
  | EmailAlreadyTaken
  | UsernameAlreadyTaken;
export type UserResponseData = { user: User };
export type CreateUserResponse = APIResponse<
  UserResponseData,
  CreateUserError
>;

export type UserNotFound = typeof UserErrors.USER_NOT_FOUND;
export type GetUserByEmailError = UserNotFound | ServerError;
export type GetUserByEmailResponse = APIResponse<
  UserResponseData,
  GetUserByEmailError
>;

export const createUserAPI = (apiURL: string) => {
  return {
    register: async (
      input: CreateUserInput,
    ): Promise<CreateUserResponse> => {
      try {
        const response = await axios.post(`${apiURL}/users`, input);
        return response.data as CreateUserResponse;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return err.response?.data as CreateUserResponse;
        }

        throw err;
      }
    },
    getUserByEmail: async (email: string) => {
      try {
        const response = await axios.get(`${apiURL}/users`, {
          params: { email },
        });

        return response.data as GetUserByEmailResponse;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return err.response?.data as GetUserByEmailResponse;
        }

        throw err;
      }
    },
  };
};
