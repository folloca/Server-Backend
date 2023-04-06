import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EstatesController } from './estates.controller';
import { EstatesService } from './estates.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import {
  EstateImageRepository,
  EstateLikeRepository,
  EstateRepository,
  MapNumberingRepository,
} from '../../repositories/estate.repository';
import { HashTagRepository } from '../../repositories/hash-tag.repository';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterUserIdMiddleware } from '../../middleware/multer-user-id.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      EstateRepository,
      MapNumberingRepository,
      EstateImageRepository,
      EstateLikeRepository,
      ProposalRepository,
      HashTagRepository,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get(`${process.env.NODE_ENV}.image.estate`),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EstatesController],
  providers: [EstatesService, JwtService],
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
