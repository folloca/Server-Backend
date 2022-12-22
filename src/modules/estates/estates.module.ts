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
  ],
  controllers: [EstatesController],
  providers: [EstatesService],
  exports: [EstatesService],
})
export class EstatesModule {}
