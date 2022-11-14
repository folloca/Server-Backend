import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import {
  AdminRepository,
  BannerRepository,
} from '../../database/repositories/admin.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { HashTagRepository } from '../../database/repositories/hash-tag.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      AdminRepository,
      BannerRepository,
      UserRepository,
      HashTagRepository,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
