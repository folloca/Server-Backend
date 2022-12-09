import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../../database/repositories/user.repository';
import { Request } from 'express';
import { JwtPayload } from './jwt.payload';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get(
        `${process.env.NODE_ENV}.auth.refresh_secret`,
      ),
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const data = req.cookies.Authentication;

    if (!data.refreshToken) {
      throw new BadRequestException('Invalid Token');
    }

    const userData = this.authService.validateRefreshToken(
      payload.userId,
      data.refreshToken,
    );

    if (!userData) {
      throw new BadRequestException('Expired Token');
    } else {
      return userData;
    }
  }
}
