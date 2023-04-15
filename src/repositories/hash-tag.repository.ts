import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { EstateTagEntity, HashTagEntity } from '../database/entities';

@TypeormRepository(HashTagEntity)
export class HashTagRepository extends Repository<HashTagEntity> {
  private managerConnection = this.manager.connection;

  async searchHashTag(word: string) {}
  async createHashTag(word: string[]) {}
}

@TypeormRepository(EstateTagEntity)
export class EstateTagRepository extends Repository<EstateTagEntity> {
  private managerConnection = this.manager.connection;

  async createEstateTag(
    estateId: number,
    estateTagId: number,
    hashTagId: number,
  ) {
    // Insert
  }
}
