import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  EstateEntity,
  EstateImageEntity,
  EstateLikeEntity,
  MapNumberingEntity,
} from '../database/entities';
import { executeQueryWithTransaction } from './functions';
import { CreateEstateDto } from '../dto/req/create-estate.dto';

@TypeormRepository(EstateEntity)
export class EstateRepository extends Repository<EstateEntity> {
  private managerConnection = this.manager.connection;

  getEstatesDataForTrending() {
    return this.query(
      `SELECT estate_id, proposal_count, total_likes, estate_name, estate_keyword, estate_use, proposal_deadline FROM estate ORDER BY proposal_count * 2 + total_likes DESC, estate_keyword ASC`,
    );
  }

  getTotalEstatesData(orderStandard: string, orderType: 'DESC' | 'ASC') {
    return this.createQueryBuilder()
      .select([
        'estate_id',
        'proposal_count',
        'estate_name',
        'estate_keyword',
        'estate_use',
        'proposal_deadline',
      ])
      .orderBy(orderStandard, orderType)
      .addOrderBy('estate_keyword', 'ASC')
      .getRawMany();
  }

  getInProgressEstatesData(orderStandard: string, orderType: 'DESC' | 'ASC') {
    const now = new Date();
    return this.createQueryBuilder()
      .select([
        'estate_id',
        'proposal_count',
        'estate_name',
        'estate_keyword',
        'estate_use',
        'proposal_deadline',
      ])
      .where('proposal_deadline > :date', { date: now })
      .orderBy(orderStandard, orderType)
      .addOrderBy('estate_keyword', 'ASC')
      .getRawMany();
  }

  getClosedEstatesData(orderStandard: string, orderType: 'DESC' | 'ASC') {
    const now = new Date();
    return this.createQueryBuilder()
      .select([
        'estate_id',
        'proposal_count',
        'estate_name',
        'estate_keyword',
        'estate_use',
        'proposal_deadline',
      ])
      .where('proposal_deadline < :date', { date: now })
      .orderBy(orderStandard, orderType)
      .addOrderBy('estate_keyword', 'ASC')
      .getRawMany();
  }

  async createEstateData(userId: number, createEstateDto: CreateEstateDto) {
    const {
      estateName,
      estateKeyword,
      estateTheme,
      extent,
      capacity,
      price,
      estateUse,
      proposalDeadline,
      ownerMessage,
    } = createEstateDto;

    const query = this.query(
      'INSERT INTO `estate`(`created_at`, `updated_at`, `deleted_at`, `estate_id`, `thumbnail_path`, `proposal_count`, `total_likes`, `estate_name`, `estate_keyword`, `extent`, `capacity`, `price`, `estate_theme`, `estate_use`, `proposal_deadline`, `map_image_path`, `owner_message`, `owner_id`) VALUES(DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, ?, ?)',
      [
        estateName,
        estateKeyword,
        extent,
        capacity,
        price,
        estateTheme,
        estateUse,
        new Date(proposalDeadline),
        ownerMessage,
        userId,
      ],
    );
    await executeQueryWithTransaction(this.managerConnection, query);
  }

  async validateEstateOwner(estateId: number, userId: number) {
    const { ownerId } = await this.findOneBy({ estateId });
    return ownerId === userId;
  }

  async deleteEstateData(estateId: number) {
    await this.softDelete(estateId);
  }

  async updateTotalLikes(estateId: number, variation: number) {
    const query = this.query(
      `UPDATE estate SET total_likes = total_likes +(?) WHERE estate_id = ?`,
      [variation, estateId],
    );
    await executeQueryWithTransaction(this.managerConnection, query);
  }
}

@TypeormRepository(MapNumberingEntity)
export class MapNumberingRepository extends Repository<MapNumberingEntity> {}

@TypeormRepository(EstateImageEntity)
export class EstateImageRepository extends Repository<EstateImageEntity> {}

@TypeormRepository(EstateLikeEntity)
export class EstateLikeRepository extends Repository<EstateLikeEntity> {
  private managerConnection = this.manager.connection;

  async addLike(userId, estateId) {
    const query = this.query(
      'INSERT INTO `estate_like`(`created_at`, `updated_at`, `deleted_at`, `estate_like_id`, `user_id`, `estate_id`) VALUES(DEFAULT, DEFAULT, DEFAULT, DEFAULT, ?, ?)',
      [userId, estateId],
    );
    await executeQueryWithTransaction(this.managerConnection, query);
  }

  async cancelLike(userId, estateId) {
    return this.query(
      'DELETE FROM `estate_like` WHERE `user_id` = ? AND `estate_id` = ?',
      [userId, estateId],
    );
  }
}
