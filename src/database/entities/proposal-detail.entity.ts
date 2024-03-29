import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { ProposalEntity } from './proposal.entity';

@Entity('proposal_detail')
export class ProposalDetailEntity extends DateColumnEntity {
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
  proposalId: number;

  @Column({
    name: 'map_numbering',
    type: 'integer',
    nullable: true,
    comment: '평면도 넘버링 번호',
  })
  @IsNumber()
  @IsOptional()
  mapNumbering: number;

  @Column({
    name: 'detail_description',
    type: 'text',
    nullable: false,
    comment: '구체화 내용',
  })
  @IsString()
  @IsNotEmpty()
  detailDescription: string;
}
