import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DateColumnEntity } from './date-column.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BannerEntity } from './banner.entity';

@Entity('admin')
export class AdminEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'admin_id',
    type: 'integer',
    comment: '관리자 인덱스',
  })
  adminId: number;

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
    name: 'nickname',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
    comment: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    comment: '실명',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    comment: '비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => BannerEntity, (banner: BannerEntity) => banner.adminId, {
    cascade: true,
  })
  banners: BannerEntity[];
}
