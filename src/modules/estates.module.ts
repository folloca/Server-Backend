import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EstatesController } from '../controllers/estates.controller';
import { EstatesService } from '../services/estates.service';
import { TypeormRepositoryModule } from './typeorm-repository.module';
import {
  EstateLikeRepository,
  EstateRepository,
  MapNumberingRepository,
} from '../repositories/estate.repository';
import {
  EstateTagRepository,
  HashTagRepository,
} from '../repositories/hash-tag.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import { EstateImageRepository } from '../repositories/image.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterUserIdMiddleware } from '../middleware/multer-user-id.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      EstateRepository,
      MapNumberingRepository,
      EstateImageRepository,
      EstateLikeRepository,
      ProposalRepository,
      HashTagRepository,
      EstateTagRepository,
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
        dest: configService.get(`${process.env.NODE_ENV}.image.estate`),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EstatesController],
  providers: [EstatesService],
  exports: [EstatesService],
})
export class EstatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterUserIdMiddleware).forRoutes({
      path: 'estates',
      method: RequestMethod.POST,
    });
  }
}
