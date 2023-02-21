import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { LinkingEntity } from './linking.entity';

@Entity('linking_image')
export class LinkingImageEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'linking_image_id',
    type: 'integer',
    comment: '링킹 이미지 인덱스',
  })
  linkingImageId: number;

  @ManyToOne(
    () => LinkingEntity,
    (linking: LinkingEntity) => linking.linkingImages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'linking_id', referencedColumnName: 'linkingId' }])
  linkingId: LinkingEntity;

  @Column({
    name: 'image_path',
    type: 'varchar',
    nullable: false,
    comment: '링킹 이미지 저장 경로',
  })
  @IsString()
  @IsNotEmpty()
  imagePath: string;
}
