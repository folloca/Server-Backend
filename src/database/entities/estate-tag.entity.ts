import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default.entity';

@Entity('estate_tag')
export class EstateTagEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'estate_tag_id',
    type: 'integer',
    comment: '공간 해시태그 인덱스',
  })
  estateTagId: number;

  // @Column()
}
