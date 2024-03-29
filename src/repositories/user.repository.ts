import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities';

@TypeormRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findAccountByOauthId(oauthId: string, registerMethod: string) {
    const userData = await this.findOne({
      where: { oauthId: oauthId, registerMethod: registerMethod },
    });

    if (!userData) {
      return false;
    } else {
      return userData;
    }
  }

  async findAccountByEmail(email: string) {
    const userData = await this.findOne({
      where: { email: email },
    });

    if (!userData) {
      return false;
    } else {
      return {
        userId: userData.userId,
        registerMethod: userData.registerMethod,
        email: userData.email,
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
    return await this.save({
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
    return await this.findOne({ where: { userId: userId } });
  }

  async findNickname(nickname: string) {
    return await this.findOneBy({ nickname: nickname });
  }

  async updateNickname(userId: number, nickname: string) {
    return await this.update({ userId }, { nickname });
  }

  async createUserOauthData(
    email: string,
    oauthId: string,
    nickname = '닉네임을입력해주세요',
    marketingReception = false,
    registerMethod: string,
  ) {
    await this.insert({
      nickname,
      email,
      oauthId,
      registerMethod,
      contactInfoPublic: true,
      trendingPlanner: false,
      trendingFielder: false,
      trendingFinder: false,
      marketingReception,
    });
  }

  async updateUserinfo(
    userId,
    profileImagePath,
    baseIntroduction,
    websiteUrl,
    snsUrl,
    contactInfoPublic,
    nickname,
    marketingReception,
  ) {
    return await this.update(
      { userId },
      {
        nickname,
        profileImagePath,
        contactInfoPublic,
        websiteUrl,
        snsUrl,
        baseIntroduction,
        marketingReception,
      },
    );
  }

  async deleteAccountByEmail(email: string) {
    return await this.softDelete({ email: email });
  }
}
