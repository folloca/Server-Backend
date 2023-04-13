import { Module } from '@nestjs/common';
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
import { KakaoStrategy } from '../auth/kakao.strategy';
import { GoogleStrategy } from '../auth/google.strategy';
import { RedisModule } from '@nestjs-modules/ioredis';

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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = await configService.get(
          `${process.env.NODE_ENV}.redis.host`,
        );
        const port = await configService.get(
          `${process.env.NODE_ENV}.redis.port`,
        );

        return {
          config: {
            url: `redis://${host}:${port}`,
            db: 1,
          },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SmtpConfig,
    JwtStrategy,
    KakaoStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
