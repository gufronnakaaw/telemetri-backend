import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LocationMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.token) {
      const check = await this.prisma.token.count({
        where: {
          token: req.header('token'),
        },
      });

      if (!check) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      return next();
    }

    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized',
    });
  }
}
