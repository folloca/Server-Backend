import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import { adjectives, nouns } from './nickname-keywords';
import { UpdateUserinfoReqDto } from './dto/req/update-userinfo-req.dto';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private redis;
  private readonly profileImageStorage;

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.redis = new Redis({
      host: configService.get(`${process.env.NODE_ENV}.redis.host`),
      port: configService.get(`${process.env.NODE_ENV}.redis.port`),
    });
    this.profileImageStorage = this.configService.get(
      `${process.env.NODE_ENV}.storage.profile`,
    );
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

  async getEditPageUserInfo(userId: number) {
    const userData = await this.userRepository.getUserData(userId);

    if (!userData) {
      throw new BadRequestException(`Wrong user Id: ${userId}`);
    } else {
      const {
        nickname,
        profileImagePath,
        email,
        contactInfoPublic,
        websiteUrl,
        baseIntroduction,
        marketingReception,
      } = userData;

      return {
        data: {
          nickname,
          profileImagePath,
          email,
          contactInfoPublic,
          websiteUrl,
          baseIntroduction,
          marketingReception,
        },
        message: `User information of user ${userId} for editing page`,
      };
    }
  }

  async checkPassword(userId: number, password: string) {
    const userData = await this.userRepository.getUserData(userId);

    if (!userData) {
      throw new BadRequestException(`Wrong user Id: ${userId}`);
    }

    const { password: hashedPassword } = userData;
    const validatePassword = await bcrypt.compare(password, hashedPassword);

    if (!validatePassword) {
      throw new UnauthorizedException('Wrong password');
    } else {
      return { message: 'Password correct' };
    }
  }

  async updateUserInfo(updateUserinfoReqDto: UpdateUserinfoReqDto) {
    const {
      userId,
      profileImage,
      baseIntroduction,
      websiteUrl,
      snsUrl,
      contactInfoPublic,
      nickname,
      password,
      marketingReception,
    } = updateUserinfoReqDto;
    const updateResult = await this.userRepository.updateUserinfo(
      userId,
      profileImage,
      baseIntroduction,
      websiteUrl,
      snsUrl,
      contactInfoPublic,
      nickname,
      password,
      marketingReception,
    );

    if (!updateResult) {
      throw new InternalServerErrorException(`Fail to update user information`);
    } else {
      return {
        message: `Updated user information of user ${userId}`,
      };
    }
  }
}
