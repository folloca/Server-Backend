import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from './jwt.payload';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.get(
        `${process.env.NODE_ENV}.auth.refresh_secret`,
      ),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const data = req.cookies?.refreshToken;

    if (!data) {
      throw new BadRequestException('Empty Token');
    } else {
      return await this.authService.validateRefreshToken(
        payload.userId,
        payload.email,
        data.refreshToken,
      );
    }
  }
}
