import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { AdminEntity, BannerEntity } from '../entities';

@TypeormRepository(AdminEntity)
export class AdminRepository extends Repository<AdminEntity> {}

@TypeormRepository(BannerEntity)
export class BannerRepository extends Repository<BannerEntity> {}
