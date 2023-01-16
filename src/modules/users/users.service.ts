import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import { adjectives, nouns } from './nickname-keywords';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private redis;

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.redis = new Redis({
      host: configService.get(`${process.env.NODE_ENV}.redis.host`),
      port: configService.get(`${process.env.NODE_ENV}.redis.port`),
    });
  }

  pickRandomKeyword(array): string {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
  }

  async getRandomNickname() {
    const adjective = this.pickRandomKeyword(adjectives);
    const noun = this.pickRandomKeyword(nouns);
    const randomNickname = adjective + noun;

    const nickNameList = await this.redis.smembers('registered_nicknames');

    if (!nickNameList.includes(randomNickname)) {
      return { randomNickname, message: 'Random unique nickname' };
    } else {
      await this.getRandomNickname();
    }
  }

  async checkNickname(nickname: string) {
    const checkResult = await this.userRepository.findNickname(nickname);

    if (checkResult) {
      return { message: `Nickname ${nickname} already exists` };
    } else {
      return { message: `Nickname ${nickname} does not exist` };
    }
  }

  async updateNickname(userId: number, nickname: string) {
    const nicknameValidity = await this.userRepository.findNickname(nickname);

    if (nicknameValidity) {
      return { message: `Nickname ${nickname} already exists` };
    } else {
      await this.userRepository.updateNickname(userId, nickname);
      return { message: `Updated nickname ${nickname}` };
    }
  }
}
