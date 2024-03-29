import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(`${process.env.NODE_ENV}.auth.jwt_secret`),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const userData = this.userRepository.getUserData(payload.userId);

    if (userData) {
      return userData;
    } else {
      throw new UnauthorizedException();
    }
  }
}
