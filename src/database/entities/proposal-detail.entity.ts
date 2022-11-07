import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DefaultEntity } from './default.entity';
import { ProposalEntity } from './proposal.entity';

@Entity('proposal_detail')
export class ProposalDetailEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'proposal_detail_id',
    type: 'integer',
    comment: '기획 구체화 인덱스',
  })
  proposalDetailId: number;

  @ManyToOne(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.proposalDetails,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'proposal_id', referencedColumnName: 'proposalId' }])
  proposalId: ProposalEntity;

  @Column({
    name: 'map_numbering',
    type: 'integer',
    nullable: false,
    comment: '평면도 넘버링 번호',
  })
  @IsNumber()
  @IsNotEmpty()
  mapNumbering: number;

  @Column({
    name: 'detail_description',
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: '구체화 내용',
  })
  @IsString()
  @IsNotEmpty()
  detailDescription: string;
}
