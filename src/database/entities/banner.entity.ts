import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateColumnEntity } from './date-column.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { AdminEntity } from './admin.entity';

@Entity('banner')
export class BannerEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'banner_id',
    type: 'integer',
    comment: '내부 배너 소스 인덱스',
  })
  bannerId: number;

  @Column({
    name: 'banner_image',
    type: 'varchar',
    nullable: false,
    comment: '배너 이미지 저장 경로',
  })
  @IsString()
  @IsNotEmpty()
  bannerImage: string;

  @ManyToOne(() => AdminEntity, (admin: AdminEntity) => admin.banners, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'admin_id', referencedColumnName: 'adminId' }])
  adminId: AdminEntity;
}
