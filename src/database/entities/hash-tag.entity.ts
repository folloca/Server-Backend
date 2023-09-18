import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { EstateTagEntity } from './estate-tag.entity';
import { ProposalTagEntity } from './proposal-tag.entity';
import { LinkingTagEntity } from './linking-tag.entity';

@Entity('hash_tag')
export class HashTagEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'hash_tag_id',
    type: 'integer',
    comment: '해시태그 인덱스',
  })
  hashTagId: number;

  @Column({
    name: 'word',
    type: 'varchar',
    length: 7,
    nullable: false,
    comment: '해시 태그 단어',
  })
  @IsString()
  @IsNotEmpty()
  @Index({ fulltext: true })
  word: string;

  @OneToMany(
    () => EstateTagEntity,
    (estate_tag: EstateTagEntity) => estate_tag.hashTagId,
    { cascade: true },
  )
  estateTags: EstateTagEntity[];

  @OneToMany(
    () => ProposalTagEntity,
    (proposal_tag: ProposalTagEntity) => proposal_tag.hashTagId,
    { cascade: true },
  )
  proposalTags: ProposalTagEntity[];

  @OneToMany(
    () => LinkingTagEntity,
    (linking_tag: LinkingTagEntity) => linking_tag.linkingTagId,
    { cascade: true },
  )
  linkingTags: LinkingTagEntity[];
}
