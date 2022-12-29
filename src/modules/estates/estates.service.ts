import { Injectable } from '@nestjs/common';
import { EstateRepository } from '../../database/repositories/estate.repository';
import { ProposalRepository } from '../../database/repositories/proposal.repository';
import { CreateEstateDto } from './dto/req/create-estate.dto';
import { PriorFilterEnumToKor } from './enum/prior-filter.enum';
import { PosteriorFilterEnumToKor } from './enum/posterior-filter.enum';

@Injectable()
export class EstatesService {
  constructor(
    private estateRepository: EstateRepository,
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

  async createEstate(createEstateDto: CreateEstateDto) {
    await this.estateRepository.createEstateData(createEstateDto);
  }
}
