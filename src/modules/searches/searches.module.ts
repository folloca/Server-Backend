import { Module } from '@nestjs/common';
import { SearchesController } from './searches.controller';
import { SearchesService } from './searches.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { HashTagRepository } from '../../database/repositories/hash-tag.repository';
import { EstateRepository } from '../../database/repositories/estate.repository';
import { ProposalRepository } from '../../database/repositories/proposal.repository';
import { LinkingRepository } from '../../database/repositories/linking.repository';

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
