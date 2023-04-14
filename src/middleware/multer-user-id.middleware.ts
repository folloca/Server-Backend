import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class MulterUserIdMiddleware implements NestMiddleware {
  private redis: Redis;
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.redis = new Redis({
      host: configService.get(`${process.env.NODE_ENV}.redis.host`),
      port: configService.get(`${process.env.NODE_ENV}.redis.port`),
      db: configService.get(`${process.env.NODE_ENV}.redis.index.auth`),
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.replace('Bearer ', '').trim();

    if (await this.redis.get(`black_${token}`)) {
      res.status(403).send({
        message: 'Blacklist Token',
      });
    }

    try {
      const { userId } = await this.jwtService.verifyAsync(token);
      req.query.userId = userId;
      next();
    } catch (err) {
      res.status(401).send({
        message: 'Expired Token',
      });
    }
  }
}
