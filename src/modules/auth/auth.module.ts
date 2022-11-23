import { CacheModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeormRepositoryModule } from '../../database/typeorm-repository.module';
import { UserRepository } from '../../database/repositories/user.repository';
import { AdminRepository } from '../../database/repositories/admin.repository';
import { SmtpConfig } from '../../config/smtp.config';

@Module({
  imports: [
    TypeormRepositoryModule.forTypeormRepository([
      UserRepository,
      AdminRepository,
    ]),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, SmtpConfig],
})
export class AuthModule {}
