import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LinkingEntity } from './linking.entity';
import { HashTagEntity } from './hash-tag.entity';

@Entity('linking_tag')
export class LinkingTagEntity {
  @PrimaryGeneratedColumn({
    name: 'linking_tag_id',
    type: 'integer',
    comment: '링킹 해시태그 인덱스',
  })
  linkingTagId: number;

  @ManyToOne(
    () => HashTagEntity,
    (hashTag: HashTagEntity) => hashTag.hashTagId,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'hash_tag_id', referencedColumnName: 'hashTagId' }])
  hashTagId: HashTagEntity;

  @ManyToOne(
    () => LinkingEntity,
    (linking: LinkingEntity) => linking.linkingTags,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'linking_id', referencedColumnName: 'linkingId' }])
  linkingId: LinkingEntity;
}
