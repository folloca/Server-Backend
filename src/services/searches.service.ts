import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EstateRepository } from 'src/repositories/estate.repository';
import {
  EstateTagRepository,
  HashTagRepository,
  ProposalTagRepository,
} from 'src/repositories/hash-tag.repository';
import { ProposalRepository } from 'src/repositories/proposal.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class SearchesService {
  constructor(
    @InjectRedis()
    private proposalRepository: ProposalRepository,
    private proposalTagRepository: ProposalTagRepository,
    private hashTagRepository: HashTagRepository,
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
