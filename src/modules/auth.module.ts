import { CacheModule, Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeormRepositoryModule } from './typeorm-repository.module';
import { UserRepository } from '../repositories/user.repository';
import { AdminRepository } from '../repositories/admin.repository';
import { SmtpConfig } from '../config/smtp.config';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RefreshStrategy } from '../auth/refresh.strategy';
import { KakaoStrategy } from '../auth/kakao.strategy';
import * as redisStore from 'cache-manager-ioredis';
import { GoogleStrategy } from '../auth/google.strategy';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      UserRepository,
      AdminRepository,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(`${process.env.NODE_ENV}.auth.jwt_secret`),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get(`${process.env.NODE_ENV}.redis.host`),
        port: configService.get(`${process.env.NODE_ENV}.redis.port`),
        ttl: 1209600,
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SmtpConfig,
    JwtStrategy,
    RefreshStrategy,
    KakaoStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
