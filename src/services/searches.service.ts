import { Injectable } from '@nestjs/common';
import { EstateRepository } from 'src/repositories/estate.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import {
  EstateTagRepository,
  HashTagRepository,
  ProposalTagRepository,
} from 'src/repositories/hash-tag.repository';

@Injectable()
export class SearchesService {
  constructor(
    private hashTagRepository: HashTagRepository,
    private proposalRepository: ProposalRepository,
    private proposalTagRepository: ProposalTagRepository,
    private estateRepository: EstateRepository,
    private estateTagRepository: EstateTagRepository,
  ) {}

  async getHashTagIdByWord(words: string[]) {
    const hashTags = (await this.hashTagRepository.getHashTagId(words)).map(
      (hashTag) => hashTag.hash_tag_id,
    );

    const estateIds = await this.estateTagRepository.getEstateIds(hashTags);
    const proposalIds = await this.proposalTagRepository.getProposalIds(
      hashTags,
    );

    return {
      proposals:
        (await this.proposalRepository.getProposalListByIds(proposalIds)) ?? [],
      estates:
        (await this.estateRepository.getEstateListByIds(estateIds)) ?? [],
      linkings: [],
    };
  }
}
