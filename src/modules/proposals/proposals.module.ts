import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import {
  OpinionRepository,
  ProposalDetailRepository,
  ProposalImageRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../../database/repositories/proposal.repository';
import { HashTagRepository } from '../../database/repositories/hash-tag.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      ProposalRepository,
      ProposalDetailRepository,
      ProposalImageRepository,
      ProposalLikeRepository,
      OpinionRepository,
      HashTagRepository,
    ]),
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
