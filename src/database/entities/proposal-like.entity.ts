import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateColumnEntity } from './date-column.entity';
import { UserEntity } from './user.entity';
import { ProposalEntity } from './proposal.entity';

@Entity('proposal_like')
export class ProposalLikeEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'proposal_like_id',
    type: 'integer',
    comment: '기획 좋아요 인덱스',
  })
  proposalLikeId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.proposalLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  userId: UserEntity;

  @ManyToOne(
    () => ProposalEntity,
    (proposal: ProposalEntity) => proposal.proposalLikes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'proposal_id', referencedColumnName: 'proposalId' }])
  proposalId: ProposalEntity;
}
