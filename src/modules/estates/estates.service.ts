import { Injectable } from '@nestjs/common';
import { EstateRepository } from '../../database/repositories/estate.repository';
import { ProposalRepository } from '../../database/repositories/proposal.repository';
import { CreateEstateDto } from './dto/req/create-estate.dto';

@Injectable()
export class EstatesService {
  constructor(
    private estateRepository: EstateRepository,
    private proposalRepository: ProposalRepository,
  ) {}

  async getEstateListByPopularity() {
    const data = await this.estateRepository.getEstatesDataForTrending();

    data.sort((a, b) => {
      return (
        b.proposal_count * 2 +
        b.total_likes -
        (a.proposal_count * 2 + a.total_likes)
      );
    });

    return {
      data,
      message: 'Estate list arranged by popularity(참여기획수:좋아요수_2:1)',
    };
  }

  async createEstate(createEstateDto: CreateEstateDto) {
    await this.estateRepository.createEstateData(createEstateDto);
  }
}
