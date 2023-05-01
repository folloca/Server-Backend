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

  async getProposalListByUserId(userId: number) {
    return await this.findBy({ plannerId: userId });
  }

  async getProposalListByLikes(proposalIds: number[]) {
    if (proposalIds.length > 0) {
      return await this.createQueryBuilder()
        .where('proposal_id IN (:...ids)', {
          ids: proposalIds,
        })
        .orderBy('created_at', 'DESC')
        .getMany();
    }
  }
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
export class ProposalLikeRepository extends Repository<ProposalLikeEntity> {
  async getLikedProposalsByUserId(userId: number) {
    return await this.findBy({ userId: userId });
  }
}

@TypeormRepository(OpinionEntity)
export class OpinionRepository extends Repository<OpinionEntity> {
  async getProposalOpinionByUserId(userId: number) {
    return await this.query(`
      SELECT 
        b.proposal_id as proposalId, 
        a.opinion_text as opinionText, 
        b.created_at as createdAt, 
        b.proposal_introduction as proposalIntroduction, 
        c.estate_name as estateName, 
        d.nickname as nickname
      FROM opinion a
      LEFT JOIN proposal b on a.proposal_id = b.proposal_id
      LEFT JOIN estate c on b.estate_id = c.estate_id
      LEFT JOIN user d on b.planner_id = d.user_id
      WHERE a.writer_id = ${userId}
    `);
  }
}
