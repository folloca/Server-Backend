import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { EstateEntity } from './estate.entity';
import { EstateLikeEntity } from './estate-like.entity';
import { ProposalEntity } from './proposal.entity';
import { ProposalLikeEntity } from './proposal-like.entity';
import { OpinionEntity } from './opinion.entity';
import { LinkingEntity } from './linking.entity';
import { LinkingLikeEntity } from './linking-like.entity';
import { LinkingRequestEntity } from './linking-request.entity';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

@Entity('user')
export class UserEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'integer',
    comment: '사용자 인덱스',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Column({
    name: 'nickname',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
    comment: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Column({
    name: 'profile_image_path',
    type: 'varchar',
    nullable: false,
    default: '가입 즉시 기본 프로필 이미지 경로로 설정할 것',
    comment: '프로필 이미지 저장 경로',
  })
  @IsString()
  @IsNotEmpty()
  profileImagePath: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    unique: true,
    comment: '이메일',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: true,
    comment: '비밀번호',
  })
  @IsString()
  password: string;

  @Column({
    name: 'register_method',
    type: 'varchar',
    nullable: false,
    comment: '가입 방법(EMAIL, KAKAO, GOOGLE)',
  })
  @IsString()
  @IsNotEmpty()
  registerMethod: string;

  @Column({
    name: 'contact_info_public',
    type: 'boolean',
    nullable: false,
    default: true,
    comment: '연락처 공개 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  contactInfoPublic: boolean;

  @Column({
    name: 'website_url',
    type: 'varchar',
    nullable: true,
    comment: '개인 웹사이트 링크',
  })
  @IsString()
  websiteUrl: string;

  @Column({
    name: 'sns_url',
    type: 'varchar',
    nullable: true,
    comment: 'SNS 링크',
  })
  @IsString()
  snsUrl: string;

  @Column({
    name: 'base_introduction',
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '한 줄 소개',
  })
  @IsString()
  baseIntroduction: string;

  @Column({
    name: 'trending_planner',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '트렌딩 플래너 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  trendingPlanner: boolean;

  @Column({
    name: 'trending_fielder',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '트렌딩 필더 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  trendingFielder: boolean;

  @Column({
    name: 'trending_finder',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '트렌딩 파인더 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  trendingFinder: boolean;

  @Column({
    name: 'email_reception',
    type: 'boolean',
    nullable: false,
    comment: '마케팅 수신 동의 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  marketingReception: boolean;

  @OneToMany(() => EstateEntity, (estate: EstateEntity) => estate.ownerId, {
    cascade: true,
  })
  estates: EstateEntity[];

  @OneToMany(
    () => EstateLikeEntity,
    (estate_like: EstateLikeEntity) => estate_like.userId,
    { cascade: true },
  )
  estateLikes: EstateLikeEntity[];

  @OneToMany(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.plannerId,
    { cascade: true },
  )
  proposals: ProposalEntity[];

  @OneToMany(
    () => ProposalLikeEntity,
    (proposal_like: ProposalLikeEntity) => proposal_like.userId,
    { cascade: true },
  )
  proposalLikes: ProposalLikeEntity[];

  @OneToMany(
    () => OpinionEntity,
    (opinion: OpinionEntity) => opinion.writerId,
    { cascade: true },
  )
  opinions: OpinionEntity[];

  @OneToMany(
    () => LinkingEntity,
    (linking: LinkingEntity) => linking.organizerId,
    { cascade: true },
  )
  linkings: LinkingEntity[];

  @OneToMany(
    () => LinkingLikeEntity,
    (linking_like: LinkingLikeEntity) => linking_like.userId,
    { cascade: true },
  )
  linkingLikes: LinkingLikeEntity[];

  @OneToMany(
    () => LinkingRequestEntity,
    (linking_request: LinkingRequestEntity) => linking_request.userId,
    { cascade: true },
  )
  linkingRequests: LinkingRequestEntity[];
}
