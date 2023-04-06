import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EstateLikeRepository,
  EstateRepository,
} from '../../repositories/estate.repository';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { CreateEstateDto } from './dto/req/create-estate.dto';
import { PriorFilterEnumToKor } from './enum/prior-filter.enum';
import { PosteriorFilterEnumToKor } from './enum/posterior-filter.enum';
import Redis from 'ioredis';

@Injectable()
export class EstatesService {
  private redis;
  constructor(
    private readonly configService: ConfigService,
    private estateRepository: EstateRepository,
    private estateLikeRepository: EstateLikeRepository,
    private proposalRepository: ProposalRepository,
  ) {
    this.redis = new Redis({
      host: configService.get(`${process.env.NODE_ENV}.redis.host`),
      port: configService.get(`${process.env.NODE_ENV}.redis.port`),
    });
  }

  async getEstateListByPopularity() {
    const data = await this.estateRepository.getEstatesDataForTrending();

    return {
      data,
      message: 'Estate list arranged by popularity(참여기획수:좋아요수_2:1)',
    };
  }

  async getEstateList(priorFilter: string, posteriorFilter: string) {
    let data;
    if (priorFilter === 'total') {
      if (posteriorFilter === 'participation') {
        data = await this.estateRepository.getTotalEstatesData(
          'proposal_count',
          'DESC',
        );
      } else if (posteriorFilter === 'latest') {
        data = await this.estateRepository.getTotalEstatesData(
          'updated_at',
          'DESC',
        );
      } else {
        data = await this.estateRepository.getTotalEstatesData(
          'updated_at',
          'ASC',
        );
      }
    } else if (priorFilter === 'inProgress') {
      if (posteriorFilter === 'participation') {
        data = await this.estateRepository.getInProgressEstatesData(
          'proposal_count',
          'DESC',
        );
      } else if (posteriorFilter === 'latest') {
        data = await this.estateRepository.getInProgressEstatesData(
          'updated_at',
          'DESC',
        );
      } else {
        data = await this.estateRepository.getInProgressEstatesData(
          'updated_at',
          'ASC',
        );
      }
    } else {
      if (posteriorFilter === 'participation') {
        data = await this.estateRepository.getClosedEstatesData(
          'proposal_count',
          'DESC',
        );
      } else if (posteriorFilter === 'latest') {
        data = await this.estateRepository.getClosedEstatesData(
          'updated_at',
          'DESC',
        );
      } else {
        data = await this.estateRepository.getClosedEstatesData(
          'updated_at',
          'ASC',
        );
      }
    }

    return {
      data,
      message: `Filtered estate list based on ${PriorFilterEnumToKor[priorFilter]} - ${PosteriorFilterEnumToKor[posteriorFilter]}`,
    };
  }

  async createEstate(userId: number, createEstateDto: CreateEstateDto) {
    await this.estateRepository.createEstateData(userId, createEstateDto);
  }

  async estateLikeUnlike(estateId: string, userId: string) {
    const likeCheck = await this.likeStatus(estateId, userId);

    let action;
    if (likeCheck) {
      await this.redis.srem(`like_estate_${estateId}`, userId);
      await this.estateRepository.updateTotalLikes(+estateId, -1);
      await this.estateLikeRepository.cancelLike(+userId, +estateId);
      action = 'Cancel';
    } else {
      await this.redis.sadd(`like_estate_${estateId}`, userId);
      await this.estateRepository.updateTotalLikes(+estateId, 1);
      await this.estateLikeRepository.addLike(+userId, +estateId);
      action = 'Add';
    }

    return { message: `${action} LIKE of estate ${estateId} from ${userId}` };
  }

  async likeStatus(estateId: string, userId: string): Promise<boolean> {
    const likesOfEstate = await this.redis.smembers(`like_estate_${estateId}`);
    console.log(likesOfEstate);
    return !!likesOfEstate.includes(userId);
  }
}
