import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  OpinionEntity,
  ProposalDetailEntity,
  ProposalEntity,
  ProposalImageEntity,
  ProposalLikeEntity,
} from '../database/entities';

@TypeormRepository(ProposalEntity)
export class ProposalRepository extends Repository<ProposalEntity> {
  async createProposalData(
    userId: number,
    thumbnail: string,
    estateId: number,
    proposalIntroduction: string,
    proposalDescription: string,
    opinionOpen: boolean,
  ) {
    const data = {
      proposalIntroduction,
      proposalDescription,
      opinionOpen,
      thumbnail,
      estateId,
      plannerId: userId,
    };
    return await this.save(data);
  }
}

@TypeormRepository(ProposalDetailEntity)
export class ProposalDetailRepository extends Repository<ProposalDetailEntity> {}

@TypeormRepository(ProposalImageEntity)
export class ProposalImageRepository extends Repository<ProposalImageEntity> {}

@TypeormRepository(ProposalLikeEntity)
export class ProposalLikeRepository extends Repository<ProposalLikeEntity> {}

@TypeormRepository(OpinionEntity)
export class OpinionRepository extends Repository<OpinionEntity> {}
