import { Module } from '@nestjs/common';
import { EstatesController } from './estates.controller';
import { EstatesService } from './estates.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import {
  EstateImageRepository,
  EstateLikeRepository,
  EstateRepository,
  MapNumberingRepository,
} from '../../database/repositories/estate.repository';
import { HashTagRepository } from '../../database/repositories/hash-tag.repository';
import { ProposalRepository } from '../../database/repositories/proposal.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [EstatesService],
  exports: [EstatesService],
})
export class EstatesModule {}
