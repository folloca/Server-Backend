import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterUserIdMiddleware } from '../../middleware/multer-user-id.middleware';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(`${process.env.NODE_ENV}.auth.jwt_secret`),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterUserIdMiddleware).forRoutes({
      path: 'users/edit',
      method: RequestMethod.PATCH,
    });
  }
}
