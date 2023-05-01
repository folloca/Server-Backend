import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { UserEntity } from './user.entity';
import { ProposalEntity } from './proposal.entity';

@Entity('opinion')
export class OpinionEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'opinion_id',
    type: 'integer',
    comment: '의견 인덱스',
  })
  opinionId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.opinions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'writer_id', referencedColumnName: 'userId' }])
  writerId: number;

  @ManyToOne(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.opinions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'proposal_id', referencedColumnName: 'proposalId' }])
  proposalId: ProposalEntity;

  @Column({
    name: 'opinion_text',
    type: 'text',
    nullable: false,
    comment: '의견 내용',
  })
  @IsString()
  @IsNotEmpty()
  opinionText: string;
}
