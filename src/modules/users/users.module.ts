import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { UserRepository } from '../../database/repositories/user.repository';
import {
  EstateLikeRepository,
  EstateRepository,
} from '../../database/repositories/estate.repository';
import {
  OpinionRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../../database/repositories/proposal.repository';
import {
  LinkingLikeRepository,
  LinkingRepository,
  LinkingRequestRepository,
} from '../../database/repositories/linking.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      UserRepository,
      EstateRepository,
      EstateLikeRepository,
      ProposalRepository,
      ProposalLikeRepository,
      OpinionRepository,
      LinkingRepository,
      LinkingRequestRepository,
      LinkingLikeRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
