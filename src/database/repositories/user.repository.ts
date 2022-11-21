import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

@TypeormRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findAccountByEmail(email) {
    const userData = await this.findOne({
      where: { email: email },
    });

    if (!userData) {
      return false;
    } else {
      return userData.registerMethod;
    }
  }
}
