import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateColumnEntity } from './date-column.entity';
import { UserEntity } from './user.entity';
import { LinkingEntity } from './linking.entity';

@Entity('linking_like')
export class LinkingLikeEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'linking_like_id',
    type: 'integer',
    comment: '링킹 좋아요 인덱스',
  })
  linkingLikeId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.linkingLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  userId: UserEntity;

  @ManyToOne(
    () => LinkingEntity,
    (linking: LinkingEntity) => linking.linkingLikes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'linking_id', referencedColumnName: 'linkingId' }])
  linkingId: LinkingEntity;
}
