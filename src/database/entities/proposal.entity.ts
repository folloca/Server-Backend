import {
  Column,
  Entity,
  JoinColumn,
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
import { ProposalTagEntity } from './proposal-tag.entity';

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
  @Column({
    name: 'planner_id',
    type: 'number',
    nullable: false,
    comment: '기획 작성자 id',
  })
  plannerId: number;

  @ManyToOne(() => EstateEntity, (estate: EstateEntity) => estate.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'estate_id', referencedColumnName: 'estateId' }])
  @Column({
    name: 'estate_id',
    type: 'number',
    nullable: false,
    comment: '공간 id',
  })
  estateId: number;

  @Column({
    name: 'thumbnail',
    type: 'varchar',
    nullable: false,
    comment: '대표 이미지 파일명',
  })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

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

  @OneToMany(
    () => ProposalTagEntity,
    (proposal_tag: ProposalTagEntity) => proposal_tag.proposalId,
    { cascade: true },
  )
  proposalTags: ProposalTagEntity[];
}
