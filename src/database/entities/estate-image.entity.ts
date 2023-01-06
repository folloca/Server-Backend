import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultEntity } from './default.entity';
import { EstateEntity } from './estate.entity';

@Entity('estate_image')
export class EstateImageEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'estate_image_id',
    type: 'integer',
    comment: '공간 이미지 인덱스',
  })
  estateImageId: number;

  @ManyToOne(
    () => EstateEntity,
    (estate: EstateEntity) => estate.estateImages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'estate_id', referencedColumnName: 'estateId' }])
  estateId: EstateEntity;

  @Column({
    name: 'image_path',
    type: 'varchar',
    nullable: false,
    comment: '공간 이미지 저장 경로',
  })
  @IsString()
  @IsNotEmpty()
  imagePath: string;

  @Column({
    name: 'original_name',
    type: 'varchar',
    nullable: false,
    comment: '원본 이미지 이름',
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;
}
