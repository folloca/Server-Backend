import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  OpinionEntity,
  ProposalDetailEntity,
  ProposalEntity,
  ProposalImageEntity,
  ProposalLikeEntity,
} from '../entities';

@TypeormRepository(ProposalEntity)
export class ProposalRepository extends Repository<ProposalEntity> {}

@TypeormRepository(ProposalDetailEntity)
export class ProposalDetailRepository extends Repository<ProposalDetailEntity> {}

@TypeormRepository(ProposalImageEntity)
export class ProposalImageRepository extends Repository<ProposalImageEntity> {}

@TypeormRepository(ProposalLikeEntity)
export class ProposalLikeRepository extends Repository<ProposalLikeEntity> {}

@TypeormRepository(OpinionEntity)
export class OpinionRepository extends Repository<OpinionEntity> {}
