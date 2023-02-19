import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { UserEntity } from './user.entity';
import { EstateEntity } from './estate.entity';
import { ProposalDetailEntity } from './proposal-detail.entity';
import { ProposalImageEntity } from './proposal-image.entity';
import { ProposalLikeEntity } from './proposal-like.entity';
import { OpinionEntity } from './opinion.entity';
import { HashTagEntity } from './hash-tag.entity';

@Entity('proposal')
export class ProposalEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'proposal_id',
    type: 'integer',
    comment: '기획 인덱스',
  })
  proposalId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'planner_id', referencedColumnName: 'userId' }])
  plannerId: UserEntity;

  @ManyToOne(() => EstateEntity, (estate: EstateEntity) => estate.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'estate_id', referencedColumnName: 'estateId' }])
  estateId: EstateEntity;

  @Column({
    name: 'thumbnail_path',
    type: 'varchar',
    nullable: false,
    comment: '대표 이미지 경로',
  })
  @IsString()
  @IsNotEmpty()
  thumbnailPath: string;

  @Column({
    name: 'total_likes',
    type: 'integer',
    nullable: false,
    default: 0,
    comment: '좋아요 수',
  })
  @IsNumber()
  @IsNotEmpty()
  totalLikes: number;

  @Column({
    name: 'proposal_introduction',
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '한 줄 소개',
  })
  @IsString()
  @IsNotEmpty()
  proposalIntroduction: string;

  @Column({
    name: 'proposal_description',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: '기획 소개',
  })
  @IsString()
  @IsNotEmpty()
  proposalDescription: string;

  @Column({
    name: 'estimated_period',
    type: 'varchar',
    nullable: false,
    comment: '예상 기간',
  })
  @IsString()
  @IsNotEmpty()
  estimatedPeriod: string;

  @Column({
    name: 'opinion_open',
    type: 'boolean',
    nullable: false,
    comment: '의견 받기 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  opinionOpen: boolean;

  @OneToMany(
    () => ProposalDetailEntity,
    (proposalDetail: ProposalDetailEntity) => proposalDetail.proposalId,
    { cascade: true },
  )
  proposalDetails: ProposalDetailEntity[];

  @OneToMany(
    () => ProposalImageEntity,
    (proposalImage: ProposalImageEntity) => proposalImage.proposalId,
    { cascade: true },
  )
  proposalImages: ProposalImageEntity[];

  @OneToMany(
    () => ProposalLikeEntity,
    (proposalLike: ProposalLikeEntity) => proposalLike.proposalId,
    { cascade: true },
  )
  proposalLikes: ProposalLikeEntity[];

  @OneToMany(
    () => OpinionEntity,
    (opinion: OpinionEntity) => opinion.proposalId,
    { cascade: true },
  )
  opinions: OpinionEntity[];

  @ManyToMany(
    () => HashTagEntity,
    (hashTag: HashTagEntity) => hashTag.proposals,
  )
  hashTags: HashTagEntity[];
}
