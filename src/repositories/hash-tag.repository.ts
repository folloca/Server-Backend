import { TypeormRepository } from '../database/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { HashTagEntity } from '../database/entities';

@TypeormRepository(HashTagEntity)
export class HashTagRepository extends Repository<HashTagEntity> {}
