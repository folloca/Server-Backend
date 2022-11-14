import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { HashTagEntity } from '../entities';

@TypeormRepository(HashTagEntity)
export class HashTagRepository extends Repository<HashTagEntity> {}
