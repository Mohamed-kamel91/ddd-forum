import express from 'express';

import { MarketingService } from './marketing-service';
import { AddEmailToListDTO } from './marketing-dtos';

export class MarketingController {
  constructor(private marketingService: MarketingService) {}

  public addEmailToList = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const dto = AddEmailToListDTO.fromRequest(req.body);
      const data = await this.marketingService.addEmailToList(dto);

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
