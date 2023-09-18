import { Module } from '@nestjs/common';
import { SearchesController } from '../controllers/searches.controller';
import { SearchesService } from '../services/searches.service';
import { TypeormRepositoryModule } from './typeorm-repository.module';
import {
  EstateTagRepository,
  HashTagRepository,
  ProposalTagRepository,
} from '../repositories/hash-tag.repository';
import { EstateRepository } from '../repositories/estate.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import { LinkingRepository } from '../repositories/linking.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      HashTagRepository,
      EstateRepository,
      EstateTagRepository,
      ProposalRepository,
      ProposalTagRepository,
      LinkingRepository,
      UserRepository,
    ]),
  ],
  controllers: [SearchesController],
  providers: [SearchesService],
})
export class SearchesModule {}
