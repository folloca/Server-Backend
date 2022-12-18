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
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DefaultEntity } from './default.entity';
import { UserEntity } from './user.entity';
import { ProposalEntity } from './proposal.entity';
import { MapNumberingEntity } from './map-numbering.entity';
import { EstateImageEntity } from './estate-image.entity';
import { EstateLikeEntity } from './estate-like.entity';
import { HashTagEntity } from './hash-tag.entity';

@Entity('estate')
export class EstateEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'estate_id',
    type: 'integer',
    comment: '공간 인덱스',
  })
  estateId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'owner_id', referencedColumnName: 'userId' }])
  ownerId: UserEntity;

  @Column({
    name: 'thumbnail_path',
    type: 'varchar',
    nullable: false,
    default: 'tmp',
    comment: '대표 이미지 경로',
  })
  @IsString()
  @IsNotEmpty()
  thumbnailPath: string;

  @Column({
    name: 'proposal_count',
    type: 'integer',
    nullable: false,
    default: 0,
    comment: '참여 기획수',
  })
  @IsNumber()
  @IsNotEmpty()
  proposalCount: number;

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
    name: 'estate_name',
    type: 'varchar',
    length: 8,
    nullable: false,
    comment: '공간 이름',
  })
  @IsString()
  @IsNotEmpty()
  estateName: string;

  @Column({
    name: 'estate_keyword',
    type: 'varchar',
    length: 5,
    nullable: false,
    comment: '공간 키워드',
  })
  @IsString()
  @IsNotEmpty()
  estateKeyword: string;

  @Column({
    name: 'extent',
    type: 'float',
    nullable: false,
    comment: '면적',
  })
  @IsNumber()
  @IsNotEmpty()
  extent: number;

  @Column({
    name: 'capacity',
    type: 'integer',
    nullable: false,
    comment: '수용 인원',
  })
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @Column({
    name: 'price',
    type: 'integer',
    nullable: false,
    comment: '가격',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Column({
    name: 'estate_theme',
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: '공간 주제',
  })
  @IsString()
  @IsNotEmpty()
  estateTheme: string;

  @Column({
    name: 'estate_use',
    type: 'varchar',
    length: 2,
    nullable: false,
    comment: '사용 용도(팝업, 전시)',
  })
  @IsString()
  @IsNotEmpty()
  estateUse: string;

  @Column({
    name: 'proposal_deadline',
    type: 'timestamp',
    nullable: false,
    comment: '기획 모집 마감 일자',
  })
  @IsDate()
  @IsNotEmpty()
  proposalDeadline: Date;

  @Column({
    name: 'map_image_path',
    type: 'varchar',
    nullable: true,
    comment: '평면도 저장 경로',
  })
  @IsString()
  @IsOptional()
  mapImagePath: string;

  @Column({
    name: 'owner_message',
    type: 'varchar',
    length: 120,
    nullable: false,
    comment: '남기고 싶은 한마디',
  })
  @IsString()
  @IsNotEmpty()
  ownerMessage: string;

  @OneToMany(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.estateId,
    { cascade: true },
  )
  proposals: ProposalEntity[];

  @OneToMany(
    () => MapNumberingEntity,
    (map_numbering: MapNumberingEntity) => map_numbering.estateId,
    { cascade: true },
  )
  mapNumberings: MapNumberingEntity[];

  @OneToMany(
    () => EstateImageEntity,
    (estate_image: EstateImageEntity) => estate_image.estateId,
    { cascade: true },
  )
  estateImages: EstateImageEntity[];

  @OneToMany(
    () => EstateLikeEntity,
    (estate_like: EstateLikeEntity) => estate_like.estateId,
    { cascade: true },
  )
  estateLikes: EstateLikeEntity[];

  @ManyToMany(() => HashTagEntity, (hashTag: HashTagEntity) => hashTag.estates)
  hashTags: HashTagEntity[];
}
