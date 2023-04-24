import { Injectable, Logger } from '@nestjs/common';
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
import { EstateRepository } from '../repositories/estate.repository';
import { CreateProposalDto } from '../dto/req/create-proposal.dto';
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
  ) {}

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

      await this.proposalDetailRepository.createDetailData(
        proposalId,
        proposalDetails,
      );

      if (hashTag1 || hashTag2) {
        const tagResult = await this.hashTagRepository.createHashTag(
          [hashTag1, hashTag2].filter(Boolean),
        );
        await this.proposalTagRepository.createEstateTag(proposalId, tagResult);
      }

      return { message: `Registered new proposal of estate ${estateId}` };
    } catch (e) {
      Logger.error(e);
    }
  }
}
