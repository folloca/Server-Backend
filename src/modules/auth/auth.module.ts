import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { UserRepository } from '../../database/repositories/user.repository';
import { AdminRepository } from '../../database/repositories/admin.repository';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      UserRepository,
      AdminRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
