import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProposalsController } from '../controllers/proposals.controller';
import { ProposalsService } from '../services/proposals.service';
import { TypeormRepositoryModule } from './typeorm-repository.module';
import {
  OpinionRepository,
  ProposalDetailRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../repositories/proposal.repository';
import { ProposalImageRepository } from '../repositories/image.repository';

import { HashTagRepository } from '../repositories/hash-tag.repository';
import { EstateRepository } from '../repositories/estate.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MulterUserIdMiddleware } from '../middleware/multer-user-id.middleware';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      ProposalRepository,
      ProposalDetailRepository,
      ProposalImageRepository,
      ProposalLikeRepository,
      OpinionRepository,
      HashTagRepository,
      EstateRepository,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(`${process.env.NODE_ENV}.auth.jwt_secret`),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get(`${process.env.NODE_ENV}.storage.proposal`),
      }),
      inject: [ConfigService],
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

        const index = await configService.get(
          `${process.env.NODE_ENV}.redis.index.proposal`,
        );

        return {
          config: {
            url: `redis://${host}:${port}`,
            db: index,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterUserIdMiddleware).forRoutes({
      path: 'proposals',
      method: RequestMethod.POST,
    });
  }
}
