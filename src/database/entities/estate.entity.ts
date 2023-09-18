import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { UserEntity } from './user.entity';
import { ProposalEntity } from './proposal.entity';
import { MapNumberingEntity } from './map-numbering.entity';
import { EstateImageEntity } from './estate-image.entity';
import { EstateLikeEntity } from './estate-like.entity';
import { EstateTagEntity } from './estate-tag.entity';

@Entity('estate')
export class EstateEntity extends DateColumnEntity {
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
  @Column({
    name: 'owner_id',
    type: 'number',
    nullable: false,
    comment: '공간 소유자 id',
  })
  ownerId: number;

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
    nullable: true,
    comment: '면적',
  })
  @IsNumber()
  extent: number;

  @Column({
    name: 'capacity',
    type: 'integer',
    nullable: true,
    comment: '수용 인원',
  })
  @IsNumber()
  capacity: number;

  @Column({
    name: 'price',
    type: 'integer',
    nullable: true,
    comment: '가격',
  })
  @IsNumber()
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
    type: 'integer',
    nullable: false,
    comment: '공간 유형(0: 팝업, 1: 전시)',
  })
  @IsNumber()
  @IsNotEmpty()
  estateUse: number;

  @Column({
    name: 'proposal_deadline',
    type: 'timestamp',
    nullable: false,
    comment: '기획 모집 마감 일자',
  })
  @IsDateString()
  @IsNotEmpty()
  proposalDeadline: string;

  @Column({
    name: 'map_image',
    type: 'varchar',
    nullable: true,
    comment: '평면도 파일명',
  })
  @IsString()
  @IsOptional()
  mapImage: string;

  @Column({
    name: 'owner_message',
    type: 'varchar',
    length: 120,
    nullable: true,
    comment: '남기고 싶은 한마디',
  })
  @IsString()
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

  @OneToMany(
    () => EstateTagEntity,
    (estate_tag: EstateTagEntity) => estate_tag.estateId,
    { cascade: true },
  )
  estateTags: EstateTagEntity[];
}
