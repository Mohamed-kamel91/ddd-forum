import express from 'express';

import type { MarketingService } from './marketing-service';
import { AddEmailToListCommand } from './marketing-command';

export class MarketingController {
  constructor(private marketingService: MarketingService) {}

  public addEmailToList = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const command = AddEmailToListCommand.fromRequest(req.body);
      const data =
        await this.marketingService.addEmailToList(command);

      return res.json({
        error: null,
        data: { subscription: data },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
