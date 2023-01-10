import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private redis;
  private readonly adjectives;
  private readonly nouns;

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.redis = new Redis({
      host: configService.get(`${process.env.NODE_ENV}.redis.host`),
      port: configService.get(`${process.env.NODE_ENV}.redis.port`),
    });
    this.adjectives = ['형용사1', '형용사2', '형용사3'];
    this.nouns = ['명사1', '명사2', '명사3'];
  }

  pickRandomKeyword(array): string {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
  }
  async getRandomNickname() {
    const adjective = this.pickRandomKeyword(this.adjectives);
    const noun = this.pickRandomKeyword(this.nouns);
    const randomNickname = adjective + noun;

    const nickNameList = await this.redis.smembers('registered_nicknames');

    if (!nickNameList.includes(randomNickname)) {
      await this.redis.sadd('registered_nicknames', randomNickname);
      return { randomNickname, message: 'Random unique nickname' };
    } else {
      await this.getRandomNickname();
    }
  }
}
