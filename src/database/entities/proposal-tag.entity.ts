import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProposalEntity } from './proposal.entity';
import { HashTagEntity } from './hash-tag.entity';

@Entity('proposal_tag')
export class ProposalTagEntity {
  @PrimaryGeneratedColumn({
    name: 'proposal_tag_id',
    type: 'integer',
    comment: '기획 해시태그 인덱스',
  })
  proposalTagId: number;

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
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.proposalTags,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'proposal_id', referencedColumnName: 'proposalId' }])
  proposalId: ProposalEntity;
}
