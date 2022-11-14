import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

@TypeormRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
