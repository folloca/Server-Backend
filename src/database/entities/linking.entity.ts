import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DefaultEntity } from './default.entity';
import { UserEntity } from './user.entity';
import { LinkingRequestEntity } from './linking-request.entity';
import { LinkingImageEntity } from './linking-image.entity';
import { LinkingLikeEntity } from './linking-like.entity';
import { HashTagEntity } from './hash-tag.entity';

@Entity('linking')
export class LinkingEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'linking_id',
    type: 'integer',
    comment: '링킹 인덱스',
  })
  linkingId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.linkings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'organizer_id', referencedColumnName: 'userId' }])
  organizerId: UserEntity;

  @Column({
    name: 'linking_deadline',
    type: 'timestamp',
    nullable: false,
    comment: '링킹 모집 마감 일자',
  })
  @IsDate()
  @IsNotEmpty()
  linkingDeadline: Date;

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
    name: 'recruit_in_progress',
    type: 'boolean',
    nullable: false,
    default: true,
    comment: '모집 완료 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  recruitInProgress: boolean;

  @Column({
    name: 'thumbnail_path',
    type: 'varchar',
    nullable: true,
    comment: '대표 이미지 경로',
  })
  @IsString()
  @IsOptional()
  thumbnailPath: string;

  @Column({
    name: 'linking_title',
    type: 'varchar',
    length: 15,
    nullable: false,
    comment: '링킹 제목',
  })
  @IsString()
  @IsNotEmpty()
  linkingTitle: string;

  @Column({
    name: 'self_introduction',
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: '작성자 소개',
  })
  @IsString()
  @IsNotEmpty()
  selfIntroduction: string;

  @Column({
    name: 'topic',
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '기획 주제',
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @Column({
    name: 'linking_start_at',
    type: 'timestamp',
    nullable: false,
    comment: '시작 일자',
  })
  @IsDate()
  @IsNotEmpty()
  linkingStartAt: Date;

  @Column({
    name: 'linking_end_at',
    type: 'timestamp',
    nullable: false,
    comment: '완료 일자',
  })
  @IsDate()
  @IsNotEmpty()
  linkingEndAt: Date;

  @Column({
    name: 'task_object',
    type: 'varchar',
    length: 2,
    nullable: false,
    comment: '작업 목적(팝업, 전시)',
  })
  @IsString()
  @IsNotEmpty()
  taskObject: string;

  @Column({
    name: 'member_count',
    type: 'integer',
    nullable: false,
    comment: '모집 인원',
  })
  @IsNumber()
  @IsNotEmpty()
  memberCount: number;

  @Column({
    name: 'hope',
    type: 'text',
    nullable: false,
    comment: '바라는 점',
  })
  @IsString()
  @IsNotEmpty()
  hope: string;

  @Column({
    name: 'map_image_path',
    type: 'varchar',
    nullable: true,
    comment: '평면도 저장 경로',
  })
  @IsString()
  @IsOptional()
  mapImagePath: string;

  @OneToMany(
    () => LinkingRequestEntity,
    (linkingRequest: LinkingRequestEntity) => linkingRequest.linkingId,
    { cascade: true },
  )
  linkingRequests: LinkingRequestEntity[];

  @OneToMany(
    () => LinkingImageEntity,
    (linkingImage: LinkingImageEntity) => linkingImage.linkingId,
    { cascade: true },
  )
  linkingImages: LinkingImageEntity[];

  @OneToMany(
    () => LinkingLikeEntity,
    (linkingLike: LinkingLikeEntity) => linkingLike.linkingId,
    { cascade: true },
  )
  linkingLikes: LinkingLikeEntity[];

  @ManyToMany(() => HashTagEntity, (hashTag: HashTagEntity) => hashTag.linkings)
  hashTags: HashTagEntity[];
}
