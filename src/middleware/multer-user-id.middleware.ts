import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MulterUserIdMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.replace('Bearer', '').trim();
    const { userId } = await this.jwtService.verifyAsync(token);
    req.query.userId = userId;
    next();
  }
}
