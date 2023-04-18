import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  EstateEntity,
  EstateLikeEntity,
  MapNumberingEntity,
} from '../database/entities';
import { executeQueryWithTransaction } from './functions';
import { CreateEstateDto, MapCoordinates } from '../dto/req/create-estate.dto';

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

  async createEstateData(
    userId: number,
    createEstateDto: CreateEstateDto,
    thumbnail: string,
    map?: string,
  ) {
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

    const query = await this.createQueryBuilder()
      .insert()
      .into('estate')
      .values([
        {
          estateName,
          estateKeyword,
          extent,
          capacity,
          price,
          estateTheme,
          estateUse,
          proposalDeadline,
          thumbnail,
          mapImage: map,
          ownerMessage,
          ownerId: userId,
        },
      ]);

    await executeQueryWithTransaction(this.managerConnection, query);

    const [{ estate_id }] = await this.createQueryBuilder()
      .select('LAST_INSERT_ID() as estate_id')
      .limit(1)
      .execute();

    return estate_id;
  }

  async validateEstateOwner(estateId: number, userId: number) {
    const { ownerId } = await this.findOneBy({ estateId });
    return ownerId === userId;
  }

  async deleteEstateData(estateId: number) {
    await this.softDelete(estateId);
  }

  async updateTotalLikes(estateId: number, variation: number) {
    const query = this.createQueryBuilder()
      .update('estate')
      .set({ totalLikes: () => `total_likes + ${variation}` })
      .where('estateId = :id', { id: estateId });
    await executeQueryWithTransaction(this.managerConnection, query);
  }
}

@TypeormRepository(MapNumberingEntity)
export class MapNumberingRepository extends Repository<MapNumberingEntity> {
  private managerConnection = this.manager.connection;

  async addNumberingTags(
    estateId: number,
    numberingCoordinates: MapCoordinates[],
  ) {
    const values = [];
    for (const tag of numberingCoordinates) {
      const { tagNumber, x, y } = tag;
      values.push({
        estateId,
        numbering: tagNumber,
        xCoordinate: x,
        yCoordinate: y,
      });
    }

    const query = await this.createQueryBuilder()
      .insert()
      .into('map_numbering')
      .values(values);

    await executeQueryWithTransaction(this.managerConnection, query);
  }
}

@TypeormRepository(EstateLikeEntity)
export class EstateLikeRepository extends Repository<EstateLikeEntity> {
  private managerConnection = this.manager.connection;

  async addLike(userId: number, estateId: number) {
    const query = this.createQueryBuilder()
      .insert()
      .into('estate_like')
      .values({ userId, estateId });
    await executeQueryWithTransaction(this.managerConnection, query);
  }

  async cancelLike(userId: number, estateId: number) {
    const query = this.createQueryBuilder()
      .delete()
      .from('estate_like')
      .where('user_id = :userId', { userId })
      .andWhere('estate_id = :estateId', { estateId });
    await executeQueryWithTransaction(this.managerConnection, query);
  }
}
