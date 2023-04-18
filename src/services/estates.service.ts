import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EstateLikeRepository,
  EstateRepository,
  MapNumberingRepository,
} from '../repositories/estate.repository';
import {
  EstateTagRepository,
  HashTagRepository,
} from '../repositories/hash-tag.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import { EstateImageRepository } from '../repositories/image.repository';
import { CreateEstateDto } from '../dto/req/create-estate.dto';
import { PriorFilterEnumToKor } from '../custom/enum/prior-filter.enum';
import { PosteriorFilterEnumToKor } from '../custom/enum/posterior-filter.enum';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class EstatesService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly configService: ConfigService,
    private estateRepository: EstateRepository,
    private estateLikeRepository: EstateLikeRepository,
    private mapNumberingRepository: MapNumberingRepository,
    private estateImageRepository: EstateImageRepository,
    private hashTagRepository: HashTagRepository,
    private estateTagRepository: EstateTagRepository,
    private proposalRepository: ProposalRepository,
  ) {}

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

  async createEstate(
    userId: number,
    filenames: { thumbnail: string; images: string[]; map: string },
    createEstateDto: CreateEstateDto,
  ) {
    const { thumbnail, images = [], map } = filenames;
    const { numberingCoordinates, hashTag1, hashTag2 } = createEstateDto;

    try {
      const newEstateId: number = await this.estateRepository.createEstateData(
        userId,
        createEstateDto,
        thumbnail,
        map,
      );

      const validFilenames = [thumbnail, ...images, map].filter(Boolean);
      await this.estateImageRepository.createImageData(
        newEstateId,
        validFilenames,
      );

      if (numberingCoordinates) {
        await this.mapNumberingRepository.addNumberingTags(
          newEstateId,
          numberingCoordinates,
        );
      }

      if (hashTag1 || hashTag2) {
        const tagResult = await this.hashTagRepository.createHashTag(
          [hashTag1, hashTag2].filter(Boolean),
        );
        await this.estateTagRepository.createEstateTag(newEstateId, tagResult);
      }
    } catch (e) {
      Logger.error(e);
    }
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
    return !!likesOfEstate.includes(String(userId));
  }

  async deleteEstate(estateId: number, userId: number) {
    const isOwner = await this.estateRepository.validateEstateOwner(
      estateId,
      userId,
    );

    if (isOwner) {
      await this.estateRepository.deleteEstateData(estateId);
      return { message: `Deleted the estate id ${estateId}` };
    } else {
      throw new BadRequestException(
        'The user is not the owner of the estate and cannot delete it',
      );
    }
  }
}
