import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  LinkingEntity,
  LinkingImageEntity,
  LinkingLikeEntity,
  LinkingRequestEntity,
} from '../entities';

@TypeormRepository(LinkingEntity)
export class LinkingRepository extends Repository<LinkingEntity> {}

@TypeormRepository(LinkingRequestEntity)
export class LinkingRequestRepository extends Repository<LinkingRequestEntity> {}

@TypeormRepository(LinkingImageEntity)
export class LinkingImageRepository extends Repository<LinkingImageEntity> {}

@TypeormRepository(LinkingLikeEntity)
export class LinkingLikeRepository extends Repository<LinkingLikeEntity> {}
