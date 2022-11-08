import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultEntity } from './default.entity';
import { ProposalEntity } from './proposal.entity';

@Entity('proposal_image')
export class ProposalImageEntity extends DefaultEntity {
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
  proposalId: ProposalEntity;

  @Column({
    name: 'image_path',
    type: 'varchar',
    nullable: false,
    comment: '기획 이미지 저장 경로',
  })
  @IsString()
  @IsNotEmpty()
  imagePath: string;
}
