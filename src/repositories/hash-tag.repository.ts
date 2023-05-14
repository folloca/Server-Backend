import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  EstateTagEntity,
  HashTagEntity,
  ProposalTagEntity,
} from '../database/entities';

@TypeormRepository(HashTagEntity)
export class HashTagRepository extends Repository<HashTagEntity> {
  private managerConnection = this.manager.connection;

  async getHashTagData(hashTagIds: number[]) {
    return await Promise.all(
      hashTagIds.map(async (id) => {
        const { word } = await this.findOneBy({ hashTagId: id });
        return word;
      }),
    );
  }

  async getHashTagId(words: string[]) {
    let fulltext = "'";

    words.map((word, index) => {
      fulltext += `${word}`;
      if (words.length - 1 !== index) {
        fulltext += `|`;
      }
    });
    fulltext += "'";

    return await this.createQueryBuilder()
      .select(['hash_tag_id, word'])
      .where(`word REGEXP (${fulltext})`)
      .getRawMany();
  }

  async createHashTag(words: string[]) {
    return await Promise.all(
      words.map(async (word) => {
        const tagSearch = await this.findOne({ where: { word } });
        if (tagSearch) {
          return tagSearch.hashTagId;
        } else {
          const { hashTagId } = await this.save({ word });
          return hashTagId;
        }
      }),
    );
  }
}

@TypeormRepository(EstateTagEntity)
export class EstateTagRepository extends Repository<EstateTagEntity> {
  private managerConnection = this.manager.connection;

  async getTagIds(estateId: number) {
    const result = await this.findBy({ estateId });
    return result.map((el) => el.hashTagId);
  }

  async getEstateIds(tagIds: number[]) {
    return this.createQueryBuilder()
      .select(['estate_id'])
      .where(`hash_tag_id IN (:id)`, { id: tagIds })
      .getRawMany();
  }

  async createEstateTag(estateId: number, hashTagIds: number[]) {
    await Promise.all(
      hashTagIds.map(async (hashTagId) => {
        await this.save({ hashTagId, estateId });
      }),
    );
  }
}

@TypeormRepository(ProposalTagEntity)
export class ProposalTagRepository extends Repository<ProposalTagEntity> {
  async getProposalTag(proposalId: number) {
    const result = await this.query(
      `
        SELECT
          GROUP_CONCAT(DISTINCT hash_tag.word) AS hashTags
        FROM proposal_tag
        INNER JOIN hash_tag ON proposal_tag.hash_tag_id = hash_tag.hash_tag_id
        WHERE proposal_id = ?
      `,
      [proposalId],
    );
    return result[0];
  }

  async getProposalIds(tagIds: number[]) {
    return this.createQueryBuilder()
      .select(['proposal_id'])
      .where(`hash_tag_id IN (:id)`, { id: tagIds })
      .getRawMany();
  }

  async createProposalTag(proposalId: number, hashTagIds: number[]) {
    await Promise.all(
      hashTagIds.map(async (hashTagId) => {
        await this.save({ hashTagId, proposalId });
      }),
    );
  }

  async deleteProposalTag(proposalId: number) {
    await this.delete({ proposalId });
  }
}
