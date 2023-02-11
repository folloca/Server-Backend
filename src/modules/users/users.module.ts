import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { UserRepository } from '../../repositories/user.repository';
import {
  EstateLikeRepository,
  EstateRepository,
} from '../../repositories/estate.repository';
import {
  OpinionRepository,
  ProposalLikeRepository,
  ProposalRepository,
} from '../../repositories/proposal.repository';
import {
  LinkingLikeRepository,
  LinkingRepository,
  LinkingRequestRepository,
} from '../../repositories/linking.repository';

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
