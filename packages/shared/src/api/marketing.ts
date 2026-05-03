import axios from 'axios';

import { APIResponse, GenericErrors } from '.';

export type EmailSubscription  = {
  email: string;
  subscribed: boolean;
};

export type Marketing = {
  subscription: EmailSubscription;
};

export type AddEmailToListError = GenericErrors;
export type AddEmailToListResponse = APIResponse<
  Marketing,
  AddEmailToListError
>;

export const createMarketingAPI = (apiURL: string) => {
  return {
    addEmailToList: async (
      email: string,
    ): Promise<AddEmailToListResponse> => {
      try {
        const response = await axios.post(`${apiURL}/marketing`, {
          email,
        });

        return response.data as AddEmailToListResponse;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return err.response?.data as AddEmailToListResponse;
        }

        throw err;
      }
    },
  };
};
