import { TypeormRepository } from '../typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

@TypeormRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findAccountByKakaoId(kakao_id: string) {
    const userData = await this.findOne({
      where: { kakao_id: kakao_id },
    });
    if (!userData) {
      return false;
    } else {
      return userData;
    }
  }
}
