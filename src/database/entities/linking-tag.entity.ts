import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default.entity';

@Entity('linking_tag')
export class LinkingTagEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'linking_tag_id',
    type: 'integer',
    comment: '링킹 해시태그 인덱스',
  })
  linkingTagId: number;

  // @Column()
}
