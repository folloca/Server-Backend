import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { UserRepository } from '../../repositories/user.repository';
import {
  EstateLikeRepository,
  EstateRepository,
} from '../../repositories/estate.repository';
import {
  OpinionRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../../repositories/proposal.repository';
import {
  LinkingLikeRepository,
  LinkingRepository,
  LinkingRequestRepository,
} from '../../repositories/linking.repository';
import { AuthService } from '../auth/auth.service';
import { SmtpConfig } from '../../config/smtp.config';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterUserIdMiddleware } from '../../middleware/multer-user-id.middleware';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      UserRepository,
      EstateRepository,
      EstateLikeRepository,
      ProposalRepository,
      ProposalLikeRepository,
      OpinionRepository,
      LinkingRepository,
      LinkingRequestRepository,
      LinkingLikeRepository,
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
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, SmtpConfig, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterUserIdMiddleware).forRoutes({
      path: 'users/edit',
      method: RequestMethod.PATCH,
    });
  }
}
