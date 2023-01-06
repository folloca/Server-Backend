import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  UserEntity,
  AdminEntity,
  BannerEntity,
  HashTagEntity,
  EstateEntity,
  EstateImageEntity,
  EstateLikeEntity,
  MapNumberingEntity,
  ProposalEntity,
  ProposalDetailEntity,
  ProposalImageEntity,
  ProposalLikeEntity,
  OpinionEntity,
  LinkingEntity,
  LinkingRequestEntity,
  LinkingLikeEntity,
  LinkingImageEntity,
} from '../database/entities';

export const TypeormConfigOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    ({
      type: configService.get(`${process.env.NODE_ENV}.database.type`),
      host: configService.get(`${process.env.NODE_ENV}.database.host`),
      port: +configService.get(`${process.env.NODE_ENV}.database.port`),
      username: configService.get(`${process.env.NODE_ENV}.database.username`),
      password: configService.get(`${process.env.NODE_ENV}.database.password`),
      database: configService.get(`${process.env.NODE_ENV}.database.name`),
      entities: [
        UserEntity,
        AdminEntity,
        BannerEntity,
        EstateEntity,
        EstateImageEntity,
        EstateLikeEntity,
        HashTagEntity,
        LinkingEntity,
        LinkingRequestEntity,
        LinkingLikeEntity,
        LinkingImageEntity,
        MapNumberingEntity,
        OpinionEntity,
        ProposalEntity,
        ProposalDetailEntity,
        ProposalImageEntity,
        ProposalLikeEntity,
      ],
      timezone: 'z',
      charset: 'utf8mb4',
      logging: configService.get(`${process.env.NODE_ENV}.database.logging`),
      synchronize: configService.get(
        `${process.env.NODE_ENV}.database.synchronize`,
      ),
      autoLoadEntities: configService.get(
        `${process.env.NODE_ENV}.database.autoLoadEntities`,
      ),
      keepConnectionAlive: configService.get(
        `${process.env.NODE_ENV}.database.keepConnectionAlive`,
      ),
    } as TypeOrmModuleOptions),
  inject: [ConfigService],
};
