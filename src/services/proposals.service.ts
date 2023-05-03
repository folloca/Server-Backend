import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import {
  ProposalDetailRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../repositories/proposal.repository';
import { ProposalImageRepository } from '../repositories/image.repository';
import {
  HashTagRepository,
  ProposalTagRepository,
} from '../repositories/hash-tag.repository';
import {
  EstateRepository,
  MapNumberingRepository,
} from '../repositories/estate.repository';
import { UserRepository } from '../repositories/user.repository';
import { CreateProposalDto } from '../dto/req/create-proposal.dto';
import { PreProposalEstateResDto } from '../dto/res/pre-proposal-estate-res.dto';
import { UpdateProposalDto } from '../dto/req/update-proposal.dto';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly configService: ConfigService,
    private proposalRepository: ProposalRepository,
    private proposalLikeRepository: ProposalLikeRepository,
    private proposalImageRepository: ProposalImageRepository,
    private proposalDetailRepository: ProposalDetailRepository,
    private proposalTagRepository: ProposalTagRepository,
    private hashTagRepository: HashTagRepository,
    private estateRepository: EstateRepository,
    private mapNumberingRepository: MapNumberingRepository,
    private userRepository: UserRepository,
  ) {}

  async getEstateBeforeProposal(userId: number, estateId: number) {
    const { estateKeyword, estateName, estateUse, proposalDeadline, mapImage } =
      await this.estateRepository.getEstateData(estateId);

    const numberingData = await this.mapNumberingRepository.getNumberingData(
      estateId,
    );

    const { contactInfoPublic } = await this.userRepository.getUserData(userId);

    const data = plainToInstance(PreProposalEstateResDto, {
      estateId,
      estateKeyword,
      estateName,
      estateUse,
      proposalDeadline,
      mapImage,
      numberingData,
      contactInfoPublic,
    });

    return {
      data,
      message: `Information of estate ${estateId} to show before writing proposal`,
    };
  }

  async createProposal(
    userId: number,
    filenames: { thumbnail: string; images: string[] },
    createProposalDto: CreateProposalDto,
  ) {
    const { thumbnail, images = [] } = filenames;
    const {
      estateId,
      proposalIntroduction,
      proposalDescription,
      proposalDetails,
      opinionOpen,
      hashTag1,
      hashTag2,
    } = createProposalDto;

    try {
      const { proposalId } = await this.proposalRepository.createProposalData(
        userId,
        thumbnail,
        +estateId,
        proposalIntroduction,
        proposalDescription,
        opinionOpen,
      );

      await this.estateRepository.updateProposalCount(+estateId, 1);

      const validFilenames = [thumbnail, ...images].filter(Boolean);
      await this.proposalImageRepository.createImageData(
        proposalId,
        validFilenames,
      );

      if (proposalDetails) {
        await this.proposalDetailRepository.createDetailData(
          proposalId,
          proposalDetails,
        );
      }

      if (hashTag1 || hashTag2) {
        const tagResult = await this.hashTagRepository.createHashTag(
          [hashTag1, hashTag2].filter(Boolean),
        );
        await this.proposalTagRepository.createProposalTag(
          proposalId,
          tagResult,
        );
      }

      return { message: `Registered new proposal of estate ${estateId}` };
    } catch (e) {
      Logger.error(e);
    }
  }

  async updateProposal(
    userId: number,
    filenames: { thumbnail: string; images: string[] },
    updateProposalDto: UpdateProposalDto,
  ) {
    const { thumbnail, images = [] } = filenames;
    const {
      proposalId,
      proposalIntroduction,
      proposalDescription,
      proposalDetails,
      opinionOpen,
      hashTag1,
      hashTag2,
    } = updateProposalDto;

    const plannerId = await this.proposalRepository.getPlannerId(proposalId);
    if (userId !== plannerId) {
      throw new BadRequestException(
        `User ${userId} is not the planner of ${proposalId}`,
      );
    } else {
      try {
        await this.proposalRepository.updateProposalData(
          proposalId,
          thumbnail,
          proposalIntroduction,
          proposalDescription,
          opinionOpen,
        );

        await this.proposalImageRepository.deleteImageData(proposalId);
        const validFilenames = [thumbnail, ...images].filter(Boolean);
        await this.proposalImageRepository.createImageData(
          proposalId,
          validFilenames,
        );

        if (proposalDetails) {
          await this.proposalDetailRepository.updateDetailData(
            proposalId,
            proposalDetails,
          );
        }

        if (hashTag1 || hashTag2) {
          await this.proposalTagRepository.deleteProposalTag(proposalId);
          const tagResult = await this.hashTagRepository.createHashTag(
            [hashTag1, hashTag2].filter(Boolean),
          );
          await this.proposalTagRepository.createProposalTag(
            proposalId,
            tagResult,
          );
        }

        return { message: `Updated proposal ${proposalId}` };
      } catch (e) {
        Logger.error(e);
      }
    }
  }

  async deleteProposal(userId: number, proposalId: number) {
    const plannerId = await this.proposalRepository.getPlannerId(proposalId);
    if (userId !== plannerId) {
      throw new BadRequestException(
        `User ${userId} is not the planner of ${proposalId}`,
      );
    } else {
      await this.proposalRepository.deleteProposal(proposalId);
      return { message: `Deleted proposal ${proposalId}` };
    }
  }

  async likeStatus(proposalId: string, userId: string): Promise<boolean> {
    const likesOfProposal = await this.redis.smembers(
      `like_proposal_${proposalId}`,
    );
    return !!likesOfProposal.includes(String(userId));
  }

  async likeCount(proposalId: number) {
    return this.redis.scard(`like_proposal_${proposalId}`);
  }

  async proposalLikeUnlike(proposalId: string, userId: number) {
    const likeCheck = await this.likeStatus(proposalId, `${userId}`);

    let action;
    if (likeCheck) {
      await this.redis.srem(`like_proposal_${proposalId}`, userId);
      await this.proposalRepository.updateTotalLikes(+proposalId, -1);
      await this.proposalLikeRepository.cancelLike(+userId, +proposalId);
      action = 'Cancel';
    } else {
      await this.redis.sadd(`like_proposal_${proposalId}`, userId);
      await this.proposalRepository.updateTotalLikes(+proposalId, 1);
      await this.proposalLikeRepository.addLike(+userId, +proposalId);
      action = 'Add';
    }

    return {
      message: `${action} LIKE of proposal ${proposalId} from ${userId}`,
    };
  }
}
