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
  
  async findAccountByEmail(email) {
    const userData = await this.findOne({
      where: { email: email },
    });

    if (!userData) {
      return false;
    } else {
      return {
        userId: userData.userId,
        registerMethod: userData.registerMethod,
      };
    }
  }

  async createUserData(
    email: string,
    password: string,
    nickname: string,
    marketingReception: boolean,
    registerMethod: string,
  ) {
    await this.insert({
      nickname,
      email,
      password,
      registerMethod,
      contactInfoPublic: true,
      trendingPlanner: false,
      trendingFielder: false,
      trendingFinder: false,
      marketingReception,
    });
  }

  async getUserData(userId: number) {
    return await this.findOne({
      where: { userId: userId },
    });
  }
}
