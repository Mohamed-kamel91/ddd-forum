import express from 'express';

import { UserService } from './user-service';
import { CreateUserDTO } from './user-dtos';

import { parseUserForResponse } from '../../shared/utils';

export class UserController {
  constructor(private userService: UserService) {}

  public createUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const dto = CreateUserDTO.fromRequest(req.body);
      const data = await this.userService.createUser(dto);

      return res.status(201).json({
        error: undefined,
        data: {
          ...data,
          user: parseUserForResponse(data.user),
        },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserByEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const email = req.query.email as string;
      const data = await this.userService.getUserByEmail(email);

      return res.status(200).json({
        error: undefined,
        data: { user: parseUserForResponse(data) },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
