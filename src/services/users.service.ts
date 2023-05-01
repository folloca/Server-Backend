import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
import {
  ProposalRepository,
  ProposalLikeRepository,
  OpinionRepository,
} from '../repositories/proposal.repository';
import {
  EstateRepository,
  EstateLikeRepository,
} from '../repositories/estate.repository';
import {
  LinkingRepository,
  LinkingLikeRepository,
  LinkingRequestRepository,
} from '../repositories/linking.repository';
import { adjectives, nouns } from '../custom/data/nickname-keywords';
import { UpdateUserinfoReqDto } from '../dto/req/update-userinfo-req.dto';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { plainToInstance } from 'class-transformer';
import { GetEstateResDto } from 'src/dto/res/get-estate-res.dto';
import { GetProposalResDto } from 'src/dto/res/get-proposal-res.dto';
import { GetLinkingResDto } from 'src/dto/res/get-linkings-res.dto';
import { OpinionResDto } from 'src/dto/res/opinion-res.dto';
import { LinkingRequestResDto } from 'src/dto/res/linkging-request-res.dto';

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
    private proposalLikeRepository: ProposalLikeRepository,
    private estateLikeRepository: EstateLikeRepository,
    private linkingLikeRepository: LinkingLikeRepository,
    private opinionRepository: OpinionRepository,
    private linkingRequestRepository: LinkingRequestRepository,
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
    const resData = await this.proposalRepository.getProposalListByUserId(
      userId,
    );

    return plainToInstance(GetProposalResDto, resData, {
      excludeExtraneousValues: true,
    });
  }

  async getEstateListByUserId(userId: number) {
    return plainToInstance(
      GetEstateResDto,
      await this.estateRepository.getEstateListByUserId(userId),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getLinkingListByUserId(userId: number) {
    return plainToInstance(
      GetLinkingResDto,
      await this.linkingRepository.getLinkingListByUserId(userId),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getLikedPostByUserId(userId: number) {
    const proposal =
      await this.proposalLikeRepository.getLikedProposalsByUserId(userId);
    const estate = await this.estateLikeRepository.getLikedEstatesByUserId(
      userId,
    );
    const linking = await this.linkingLikeRepository.getLikedLinkingssByUserId(
      userId,
    );

    return {
      total_cnt: proposal.length + estate.length + linking.length,
      posts: {
        proposals: proposal,
        estates: estate,
        linkings: linking,
      },
    };
  }

  async getSentOpinionByUserId(userId: number) {
    const proposals = await this.opinionRepository.getProposalOpinionByUserId(
      userId,
    );

    const linkings =
      await this.linkingRequestRepository.getLinkingsRequestByUserId(userId);

    return {
      total_cnt: proposals.length + linkings.length,
      posts: {
        proposals: plainToInstance(OpinionResDto, proposals, {
          excludeExtraneousValues: true,
        }),
        linkings: plainToInstance(LinkingRequestResDto, linkings, {
          excludeExtraneousValues: true,
        }),
      },
    };
  }

  async getLatestSeen(userId: number) {
    const proposalIdList = await this.redis.zrevrange(
      `latest_seen_proposals_${userId}`,
      0,
      -1,
    );
    const estateIdList = await this.redis.zrevrange(
      `latest_seen_estates_${userId}`,
      0,
      -1,
    );
    const linkingIdList = await this.redis.zrevrange(
      `latest_seen_linkings_${userId}`,
      0,
      -1,
    );

    return {
      total_cnt:
        proposalIdList.length + estateIdList.length + linkingIdList.length,
      posts: {
        proposals: proposalIdList,
        estates: estateIdList,
        linkings: linkingIdList,
      },
    };
  }

  async getLikesPostByIds(
    proposalIds: number[],
    linkingIds: number[],
    estateIds: number[],
  ) {
    return {
      proposals: plainToInstance(
        GetProposalResDto,
        await this.proposalRepository.getProposalListByIds(proposalIds),
        {
          excludeExtraneousValues: true,
        },
      ),
      linkings: plainToInstance(
        LinkingRequestResDto,
        await this.linkingRepository.getLinkingListByIds(linkingIds),
        {
          excludeExtraneousValues: true,
        },
      ),
      estates: plainToInstance(
        GetEstateResDto,
        await this.estateRepository.getEstateListByIds(estateIds),
        {
          excludeExtraneousValues: true,
        },
      ),
    };
  }

  async getLatestSeenPosts(posts: {
    proposals: any;
    linkings: any;
    estates: any;
  }) {
    return {
      proposals: plainToInstance(
        GetProposalResDto,
        await this.proposalRepository.getProposalListByIds(posts.proposals),
        {
          excludeExtraneousValues: true,
        },
      ),
      linkings: plainToInstance(
        GetLinkingResDto,
        await this.linkingRepository.getLinkingListByIds(posts.linkings),
        {
          excludeExtraneousValues: true,
        },
      ),
      estates: plainToInstance(
        GetEstateResDto,
        await this.estateRepository.getEstateListByIds(posts.estates),
        {
          excludeExtraneousValues: true,
        },
      ),
    };
  }
}
