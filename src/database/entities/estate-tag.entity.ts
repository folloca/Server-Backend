import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstateEntity } from './estate.entity';
import { HashTagEntity } from './hash-tag.entity';

@Entity('estate_tag')
export class EstateTagEntity {
  @PrimaryGeneratedColumn({
    name: 'estate_tag_id',
    type: 'integer',
    comment: '공간 해시태그 인덱스',
  })
  estateTagId: number;

  @ManyToOne(
    () => HashTagEntity,
    (hashTag: HashTagEntity) => hashTag.estateTags,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'hash_tag_id', referencedColumnName: 'hashTagId' }])
  @Column({
    name: 'hash_tag_id',
    type: 'number',
    nullable: false,
    comment: '해시태그 id',
  })
  hashTagId: number;

  @ManyToOne(() => EstateEntity, (estate: EstateEntity) => estate.estateTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'estate_id', referencedColumnName: 'estateId' }])
  estateId: number;
}
