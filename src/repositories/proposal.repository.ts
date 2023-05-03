import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  OpinionEntity,
  ProposalDetailEntity,
  ProposalEntity,
  ProposalLikeEntity,
} from '../database/entities';
import { ProposalDetailsDto } from '../dto/req/create-proposal.dto';
import { executeQueryWithTransaction } from './functions';

@TypeormRepository(ProposalEntity)
export class ProposalRepository extends Repository<ProposalEntity> {
  private managerConnection = this.manager.connection;

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
    if (userId) {
      return await this.query(`
        SELECT
          a.proposal_id as proposalId,
          b.nickname as nickname,
          c.estate_name as estateName,
          a.thumbnail as thunmbail,
          a.proposal_introduction as proposalIntroduction
        FROM proposal a
        LEFT JOIN user b ON a.planner_id = b.user_id
        LEFT JOIN estate c on a.estate_id = c.estate_id
        WHERE planner_id = ${userId}
      `);
    }
  }

  async getProposalListByIds(proposalIds: number[]) {
    if (proposalIds.length > 0) {
      return await this.query(`
        SELECT 
          a.proposal_id as proposalId,
          b.estate_name as estateName,
          c.nickname as nickname,
          a.thumbnail as thunmbail,
          a.proposal_introduction as proposalIntroduction,
          a.created_at as createdAt
        FROM proposal a
        LEFT JOIN estate b on a.estate_id = b.estate_id
        LEFT JOIN user c on b.owner_id = c.user_id
        WHERE proposal_id IN (${proposalIds})
      `);
    }
  }

  async getPlannerId(proposalId: number) {
    const { plannerId } = await this.findOneBy({ proposalId });
    return plannerId;
  }

  async deleteProposal(proposalId: number) {
    await this.softDelete({ proposalId });
  }

  async updateProposalData(
    proposalId: number,
    thumbnail: string,
    proposalIntroduction?: string,
    proposalDescription?: string,
    opinionOpen?: boolean,
  ) {
    await this.update(
      { proposalId },
      { thumbnail, proposalIntroduction, proposalDescription, opinionOpen },
    );
  }

  async updateTotalLikes(proposalId: number, variation: number) {
    const query = this.createQueryBuilder()
      .update('proposal')
      .set({ totalLikes: () => `total_likes + ${variation}` })
      .where('proposalId = :id', { id: proposalId });
    await executeQueryWithTransaction(this.managerConnection, query);
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

  async updateDetailData(
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
    await this.upsert(data, ['proposalId', 'mapNumbering']);
  }
}

@TypeormRepository(ProposalLikeEntity)
export class ProposalLikeRepository extends Repository<ProposalLikeEntity> {
  private managerConnection = this.manager.connection;
  async getLikedProposalsByUserId(userId: number) {
    return await this.findBy({ userId: userId });
  }

  async checkLike(userId: number, proposalId: number): Promise<boolean> {
    const result = await this.findOneBy({ userId, proposalId });
    return !!result;
  }

  async addLike(userId: number, proposalId: number) {
    const query = this.createQueryBuilder()
      .insert()
      .into('proposal_like')
      .values({ userId, proposalId });
    await executeQueryWithTransaction(this.managerConnection, query);
  }

  async cancelLike(userId: number, proposalId: number) {
    const query = this.createQueryBuilder()
      .delete()
      .from('proposal_like')
      .where('user_id = :userId', { userId })
      .andWhere('proposal_id = :proposalId', { proposalId });
    await executeQueryWithTransaction(this.managerConnection, query);
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
