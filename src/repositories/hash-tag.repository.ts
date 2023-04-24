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
  async createEstateTag(proposalId: number, hashTagIds: number[]) {
    await Promise.all(
      hashTagIds.map(async (hashTagId) => {
        await this.save({ hashTagId, proposalId });
      }),
    );
  }
}
