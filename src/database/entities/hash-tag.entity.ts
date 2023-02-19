import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { EstateEntity } from './estate.entity';
import { ProposalEntity } from './proposal.entity';
import { LinkingEntity } from './linking.entity';

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
  word: string;

  @ManyToMany(() => EstateEntity, (estate: EstateEntity) => estate.hashTags)
  @JoinTable({
    name: 'estate_tag',
    joinColumn: {
      name: 'hash_tag_id',
      referencedColumnName: 'hashTagId',
    },
    inverseJoinColumn: {
      name: 'estate_id',
      referencedColumnName: 'estateId',
    },
  })
  estates: EstateEntity[];

  @ManyToMany(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.hashTags,
  )
  @JoinTable({
    name: 'proposal_tag',
    joinColumn: {
      name: 'hash_tag_id',
      referencedColumnName: 'hashTagId',
    },
    inverseJoinColumn: {
      name: 'proposal_id',
      referencedColumnName: 'proposalId',
    },
  })
  proposals: ProposalEntity[];

  @ManyToMany(() => LinkingEntity, (linking: LinkingEntity) => linking.hashTags)
  @JoinTable({
    name: 'linking_tag',
    joinColumn: {
      name: 'hash_tag_id',
      referencedColumnName: 'hashTagId',
    },
    inverseJoinColumn: {
      name: 'linking_id',
      referencedColumnName: 'linkingId',
    },
  })
  linkings: LinkingEntity[];
}
