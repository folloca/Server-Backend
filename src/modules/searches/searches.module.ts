import { Module } from '@nestjs/common';
import { SearchesController } from './searches.controller';
import { SearchesService } from './searches.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { HashTagRepository } from '../../repositories/hash-tag.repository';
import { EstateRepository } from '../../repositories/estate.repository';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { LinkingRepository } from '../../repositories/linking.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      HashTagRepository,
      EstateRepository,
      ProposalRepository,
      LinkingRepository,
    ]),
  ],
  controllers: [SearchesController],
  providers: [SearchesService],
})
export class SearchesModule {}
