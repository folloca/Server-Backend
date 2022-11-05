import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EstatesModule } from './modules/estates/estates.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { LinkingsModule } from './modules/linkings/linkings.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    UsersModule,
    EstatesModule,
    ProposalsModule,
    LinkingsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
