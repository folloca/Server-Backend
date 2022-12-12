import { CacheModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { UserRepository } from '../../database/repositories/user.repository';
import { AdminRepository } from '../../database/repositories/admin.repository';
import { SmtpConfig } from '../../config/smtp.config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RefreshStrategy } from './jwt/refresh.strategy';
import * as redisStore from 'cache-manager-ioredis';

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
  providers: [AuthService, SmtpConfig, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
