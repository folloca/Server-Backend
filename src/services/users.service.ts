import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import { EstateRepository } from '../repositories/estate.repository';
import { LinkingRepository } from '../repositories/linking.repository';
import { adjectives, nouns } from '../custom/data/nickname-keywords';
import { UpdateUserinfoReqDto } from '../dto/req/update-userinfo-req.dto';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private redis;
  private readonly profileImageStorage;

  constructor(
    private readonly configService: ConfigService,
    private userRepository: UserRepository,
    private proposalRepository: ProposalRepository,
    private estateRepository: EstateRepository,
    private linkingRepository: LinkingRepository,
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
    const nicknameValidity = await this.userRepository.findNickname(nickname);

    if (nicknameValidity) {
      return { message: `Nickname ${nickname} already exists` };
    } else {
      return { message: `Nickname ${nickname} does not exist` };
    }
  }

  async updateNickname(userId: number, newName: string, oldName: string) {
    const nicknameValidity = await this.userRepository.findNickname(newName);

    if (nicknameValidity) {
      return { message: `Nickname ${newName} already exists` };
    } else {
      await this.userRepository.updateNickname(userId, newName);
      await this.redis.srem('registered_nicknames', oldName);
      await this.redis.sadd('registered_nicknames', newName);
      return { message: `Updated nickname ${newName}` };
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

  async getUserData(userId: number) {
    const userData = await this.userRepository.getUserData(userId);

    if (!userData) {
      throw new BadRequestException(`Wrong user Id: ${userId}`);
    } else {
      return userData;
    }
  }

  async checkPassword(userId: number, password: string) {
    const userData = await this.getUserData(userId);
    const { password: hashedPassword } = userData;
    const validatePassword = await bcrypt.compare(password, hashedPassword);

    if (!validatePassword) {
      throw new UnauthorizedException('Wrong password');
    } else {
      return { message: 'Password correct' };
    }
  }

  async updateUserInfo(
    userId: number,
    updateUserinfoReqDto: UpdateUserinfoReqDto,
  ) {
    const {
      profileImage,
      baseIntroduction,
      websiteUrl,
      snsUrl,
      contactInfoPublic,
      nickname,
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
      marketingReception,
    );
    await this.getUserData(+userId);

    if (!updateResult) {
      throw new HttpException(
        'Failed to update user information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return {
        message: `Updated user information of user ${userId}`,
      };
    }
  }

  async getProfilePageUserInfo(email: string) {
    const user = await this.userRepository.findAccountByEmail(email);

    if (!user) {
      throw new BadRequestException(`Wrong user Email: ${email}`);
    } else {
      const { userId } = user;

      const userData = await this.userRepository.getUserData(userId);

      return {
        userId: userId,
        nickname: userData.nickname,
        website_url: userData.websiteUrl,
        sns_url: userData.snsUrl,
        base_introduction: userData.baseIntroduction,
        trending_planner: userData.trendingPlanner,
        trending_fielder: userData.trendingFielder,
        trending_finder: userData.trendingFinder,
      };
    }
  }

  async getProposalListByUserId(userId: number) {
    return await this.proposalRepository.getProposalListByUserId(userId);
  }

  async getEstateListByUserId(userId: number) {
    return await this.estateRepository.getEstateListByUserId(userId);
  }

  async getLinkingListByUserId(userId: number) {
    return await this.linkingRepository.getLinkingListByUserId(userId);
  }
}
