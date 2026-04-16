import { User } from '../../generated/prisma/client';

export const parseForResponse = (data: unknown) => {
  return JSON.parse(JSON.stringify(data));
};

export function parseUserForResponse(user: User) {
  const returnData = parseForResponse(user);
  delete returnData.password;
  return returnData;
}
