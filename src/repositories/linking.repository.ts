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
    // return await this.findBy({ userId: userId });

    return await this.query(`
      SELECT 
        b.linking_id as linkingId, 
        a.participate_message as participateMessage, 
        b.created_at as createdAt, 
        b.linking_title as linkingTitle, 
        b.member_count as memberCount, 
        b.linking_deadline as linkingDeadline, 
        b.recruit_in_progress as recruitInProgress
      FROM linking_request a
      LEFT JOIN linking b on a.linking_id = b.linking_id
      WHERE a.user_id = ${userId}
    `);
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
