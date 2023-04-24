import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { ProposalEntity } from './proposal.entity';

@Entity('proposal_image')
export class ProposalImageEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'proposal_image_id',
    type: 'integer',
    comment: '기획 이미지 인덱스',
  })
  proposalImageId: number;

  @ManyToOne(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.proposalImages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'proposal_id', referencedColumnName: 'proposalId' }])
  proposalId: number;

  @Column({
    name: 'image',
    type: 'varchar',
    nullable: false,
    comment: '기획 이미지 파일명',
  })
  @IsString()
  @IsNotEmpty()
  imageName: string;
}
