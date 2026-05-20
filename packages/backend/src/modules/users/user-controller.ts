import express from 'express';

import { UserService } from './user-service';
import { CreateUserCommand } from './user-command';

import {
  CreateUserResponse,
  GetUserByEmailResponse,
} from '@dddforum/shared/api/user';

export class UserController {
  constructor(private userService: UserService) {}

  public createUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const command = CreateUserCommand.fromRequest(req.body);
      const user = await this.userService.createUser(command);
      const response: CreateUserResponse = {
        error: null,
        data: {
          user,
        },
        success: true,
      };
      return res.status(201).json(response);
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
      const user = await this.userService.getUserByEmail(email);
      const response: GetUserByEmailResponse = {
        error: null,
        data: {
          user,
        },
        success: true,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
