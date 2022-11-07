import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default.entity';

@Entity('proposal_tag')
export class ProposalTagEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'proposal_tag_id',
    type: 'integer',
    comment: '기획 해시태그 인덱스',
  })
  proposalTagId: number;

  // @Column()
}
