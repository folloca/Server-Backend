import { Module } from '@nestjs/common';
import { ProposalsController } from '../controllers/proposals.controller';
import { ProposalsService } from '../services/proposals.service';
import { TypeormRepositoryModule } from './typeorm-repository.module';
import {
  OpinionRepository,
  ProposalDetailRepository,
  ProposalImageRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../repositories/proposal.repository';
import { HashTagRepository } from '../repositories/hash-tag.repository';

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
