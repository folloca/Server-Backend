import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import {
  EstateEntity,
  EstateImageEntity,
  EstateLikeEntity,
  MapNumberingEntity,
} from '../entities';

@TypeormRepository(EstateEntity)
export class EstateRepository extends Repository<EstateEntity> {}

@TypeormRepository(MapNumberingEntity)
export class MapNumberingRepository extends Repository<MapNumberingEntity> {}

@TypeormRepository(EstateImageEntity)
export class EstateImageRepository extends Repository<EstateImageEntity> {}

@TypeormRepository(EstateLikeEntity)
export class EstateLikeRepository extends Repository<EstateLikeEntity> {}
