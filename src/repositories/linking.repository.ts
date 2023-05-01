import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  LinkingEntity,
  LinkingImageEntity,
  LinkingLikeEntity,
  LinkingRequestEntity,
} from '../database/entities';

@TypeormRepository(LinkingEntity)
export class LinkingRepository extends Repository<LinkingEntity> {
  async getLinkingListByUserId(userId: number) {
    return this.findBy({ organizerId: userId });
  }

  async getLinkingListByLikes(linkingIds: number[]) {
    if (linkingIds.length > 0) {
      return await this.createQueryBuilder()
        .where('linking_id IN (:...ids)', {
          ids: linkingIds,
        })
        .orderBy('created_at', 'DESC')
        .getRawMany();
    }
  }
}

@TypeormRepository(LinkingRequestEntity)
export class LinkingRequestRepository extends Repository<LinkingRequestEntity> {
  async getLinkingsRequestByUserId(userId: number) {
    return await this.findBy({ userId: userId });
  }
}

@TypeormRepository(LinkingImageEntity)
export class LinkingImageRepository extends Repository<LinkingImageEntity> {}

@TypeormRepository(LinkingLikeEntity)
export class LinkingLikeRepository extends Repository<LinkingLikeEntity> {
  async getLikedLinkingssByUserId(userId: number) {
    return await this.findBy({ userId: userId });
  }
}
