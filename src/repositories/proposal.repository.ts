import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  OpinionEntity,
  ProposalDetailEntity,
  ProposalEntity,
  ProposalLikeEntity,
} from '../database/entities';
import { ProposalDetailsDto } from '../dto/req/create-proposal.dto';

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

  async getPlannerId(proposalId: number) {
    const { plannerId } = await this.findOneBy({ proposalId });
    return plannerId;
  }

  async deleteProposal(proposalId: number) {
    await this.delete({ proposalId });
  }

  async updateProposalData(
    proposalId: number,
    thumbnail: string,
    proposalIntroduction: string,
    proposalDescription: string,
    opinionOpen: boolean,
  ) {}
}

@TypeormRepository(ProposalDetailEntity)
export class ProposalDetailRepository extends Repository<ProposalDetailEntity> {
  async createDetailData(
    proposalId: number,
    proposalDetails: ProposalDetailsDto,
  ) {
    const data = [];
    for (const detail of Object.entries(proposalDetails)) {
      data.push({
        proposalId,
        mapNumbering: +detail[0],
        detailDescription: detail[1],
      });
    }
    await this.save(data);
  }
}

@TypeormRepository(ProposalLikeEntity)
export class ProposalLikeRepository extends Repository<ProposalLikeEntity> {}

@TypeormRepository(OpinionEntity)
export class OpinionRepository extends Repository<OpinionEntity> {}
