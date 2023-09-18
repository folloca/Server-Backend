import { Module } from '@nestjs/common';
import { LinkingsController } from '../controllers/linkings.controller';
import { LinkingsService } from '../services/linkings.service';
import { TypeormRepositoryModule } from './typeorm-repository.module';
import {
  LinkingImageRepository,
  LinkingLikeRepository,
  LinkingRepository,
  LinkingRequestRepository,
} from '../repositories/linking.repository';
import { HashTagRepository } from '../repositories/hash-tag.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      LinkingRepository,
      LinkingRequestRepository,
      LinkingImageRepository,
      LinkingLikeRepository,
      HashTagRepository,
    ]),
  ],
  controllers: [LinkingsController],
  providers: [LinkingsService],
  exports: [LinkingsService],
})
export class LinkingsModule {}
